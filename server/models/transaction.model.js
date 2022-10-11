const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TransactionSchema = new Schema(
  {
    senderName: { type: String, required: true, trim: true },
    recieverName: { type: String, required: true, trim: true },
    senderEmail: { type: String, required: true, trim: true },
    recieverEmail: { type: String, required: true, trim: true },
    funds: { type: Number, required: true},
    date : { type: Date, required: true, default: Date.now},
  }
);

var Transaction = mongoose.model('Transaction', TransactionSchema);
module.exports = Transaction;
