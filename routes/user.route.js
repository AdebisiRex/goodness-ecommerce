const express = require("express");
const router  = express.Router()
const {signin, getDashboard,eCommerceReg, transactions, getTransactionHistory}= require ("../controllers/user.controller")

router.get("/dashboard", getDashboard)
router.post("/signin", signin)

router.post("/eCommerceReg", eCommerceReg)
router.post("/payment", transactions)
router.post("/getPaymentHistory", getTransactionHistory)

module.exports = router