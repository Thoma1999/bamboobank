import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "react-jwt";

function Dashboard() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState("");
  const [email, setEmail] = useState("");
  const [funds, setFunds] = useState("");
  const [transactions, setTransactions] = useState([]);

  // Get transactions from db
  async function getTransactions() {
    const req = await fetch("http://localhost:1337/api/transactions", {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });
    const data = await req.json();
    if (data.success) {
      setTransactions(data.transactions);
    }
  }

  // Post transaction to db
  async function sendFunds(event) {
    event.preventDefault();
    const response = await fetch("http://localhost:1337/api/transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        funds,
        email,
      }),
    });
    const data = await response.json();
    console.log(data);
    if (data["success"]) {
      alert("Transaction complete");
    } else {
      alert(data.message);
    }
    getBalance();
  }

  // Get balance from db
  async function getBalance() {
    const req = await fetch("http://localhost:1337/api/balance", {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });
    const data = await req.json();
    if (data.success) {
      setBalance(data.balance);
    } else {
      alert(data.message);
    }
  }

  // Update transactions and balance on render
  // Check authentication on render
  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = document.getElementById("name");
    if (token) {
      const user = decodeToken(token);
      if (!user) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      } else {
        let names = [];
        names.push(user.firstname);
        names.push(user.lastname);
        name.innerHTML = "Welcome " + names.join(" ");
        getBalance();
        getTransactions();
      }
    } else {
      navigate("/login", { replace: true });
    }
  });

  function logout(event) {
    event.preventDefault();
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  }


  return (
    <div>
      <button onClick={logout}>Logout</button>
      <h1>Dashboard</h1>
      <h2 id="name">No name</h2>
      <h2>Your balance: {balance || "Not found"} </h2>
      <h2>Send Money</h2>
      <div id="errors"></div>
      <form onSubmit={sendFunds}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="JohnSmith@gmail.com"
          id="email"
          required
        />
        <input
          value={funds}
          onChange={(e) => setFunds(e.target.value)}
          type="number"
          placeholder="0"
          id="funds"
          required
          min="0"
        />
        <input type="submit" value="Send" />
      </form>
      <h2>Transactions</h2>
      <div>
        <ul>
          {transactions.map((item) => (
            <li key={item._id}>
              <div>Sender: {item.senderName}</div>
              <div>Reciever: {item.recieverName}</div>
              <div>Funds: {item.funds}</div>
              <div>Date: {item.date.substring(0, 10)}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
