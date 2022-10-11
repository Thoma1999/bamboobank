const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AccountSchema = new Schema(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, required: true}
  }
);

var Account = mongoose.model('Account', AccountSchema);


module.exports = Account;
