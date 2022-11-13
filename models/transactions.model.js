const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
    amount: Number, 
    items: [Array],
    userID: String
})

const transactionModel = mongoose.model("commerce-transactions", transactionSchema);

module.exports= transactionModel