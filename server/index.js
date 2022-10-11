const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const SECRET = "s0mesecretf0rpassw0rds";

const defaultAmount = 100.0;
const app = express();
app.use(cors());

app.use(express.json());

// Database schemas and connection
const Account = require("./models/account.model");
const Transaction = require("./models/transaction.model");
mongoose.connect("mongodb://mongodb:27017/bamboo-bank", {
  useNewUrlParser: true,
});

// Creates a new account
app.post("/api/register", async (req, res) => {
  try {
    const encPassword = await bcrypt.hash(req.body.password, 10);
    await Account.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email.toLowerCase(),
      password: encPassword,
      balance: defaultAmount,
    });
    res.status(200).json({
      success: true,
      message: "Account created",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: "Email already linked to an account",
    });
  }
});

// Authenticates a login attempt
app.post("/api/login", async (req, res) => {
  // Check for account
  const account = await Account.findOne({
    email: req.body.email.toLowerCase(),
  });

  if (!account) {
    return res.status(403).json({
      success: false,
      message: "Login unsuccessful",
      user: false,
    });
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(
    req.body.password,
    account.password
  );

  if (isPasswordValid) {
    const token = jwt.sign(
      {
        firstname: account.firstname,
        lastname: account.lastname,
        email: req.body.email,
      },
      SECRET
    );
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: token,
    });
  } else {
    res.status(403).json({
      success: false,
      message: "Login unsuccessful",
      user: false,
    });
  }
});

// Returns the balance of an account
app.get("/api/balance", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, SECRET);
    const email = decoded.email.toLowerCase();
    const account = await Account.findOne({ email: email });
    return res.status(200).json({
      success: true,
      balance: account.balance,
    });
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Invalid token",
    });
  }
});

// Returns a list of transactions of an account
app.get("/api/transactions", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    const decoded = jwt.verify(token, SECRET);
    const email = decoded.email.toLowerCase();
    const account = await Account.findOne({ email: email });
    if (account) {
      const transactions = await Transaction.find()
        .or([{ senderEmail: email }, { recieverEmail: email }])
        .sort({ date: 1 });
      res.status(200).json({
        success: true,
        transactions: transactions,
      });
    }
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Invalid token",
    });
  }
});

// Creates a transaction
app.post("/api/transaction", async (req, res) => {
  const token = req.headers["x-access-token"];
  try {
    // Retrive accounts for transaction
    const decoded = jwt.verify(token, SECRET);
    const email = decoded.email.toLowerCase();
    let fundSent = false;
    let fundRecieved = false;
    const senderAccount = await Account.findOne({ email: email });
    const recieverAccount = await Account.findOne({
      email: req.body.email.toLowerCase(),
    });

    // Check for sufficient funds before withdraw
    if (senderAccount.balance > req.body.funds) {
      let newBalance =
        parseFloat(senderAccount.balance) - parseFloat(req.body.funds);
      senderAccount.balance = newBalance;
      await senderAccount.save();
      fundSent = true;
    } else {
      res.status(400).json({
        success: false,
        message: "Insuffecient funds",
      });
    }

    // Confirm withdraw before depositing new funds
    if (fundSent) {
      let newBalance =
        parseFloat(recieverAccount.balance) + parseFloat(req.body.funds);
      recieverAccount.balance = newBalance;
      await recieverAccount.save();
      fundRecieved = true;
    }

    // Record transaction in db
    if (fundRecieved && fundSent) {
      await Transaction.create({
        senderName: senderAccount.firstname + "." + senderAccount.lastname,
        senderEmail: senderAccount.email,
        recieverName:
          recieverAccount.firstname + "." + recieverAccount.lastname,
        recieverEmail: recieverAccount.email,
        funds: req.body.funds,
      });
      res.status(200).json({
        success: false,
        message: "Transaction Complete",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Transaction failed",
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Transaction failed",
    });
  }
});

app.listen(1337, () => {
  console.log("Server started on port 1337");
});
