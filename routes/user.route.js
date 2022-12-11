const express = require("express");
const router  = express.Router()
const {signin, getDashboard,eCommerceReg, transactions, getTransactionHistory, tester, forgotPassword, newPassword}= require ("../controllers/user.controller")

router.get("/", tester)

router.get("/dashboard", getDashboard)
router.post("/signin", signin)
router.post("/forgot-password", forgotPassword)
router.post("/update-password", newPassword)

router.post("/register", eCommerceReg)
router.post("/payment", transactions)
router.post("/getPaymentHistory", getTransactionHistory)

module.exports = router