const eCommerceUserModel = require("../models/eCommerceUser.model");

const transactionModel = require("../models/transactions.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")

const { sendMail, resetEmail} = require("./functions")

const tester = (req, res) => {
  res.send("This is the user guy");
};

const signin = (req, res) => {
  console.log(req.body);
  let { email, password } = req.body;
  eCommerceUserModel.findOne({ email: email }, (err, user) => {
    if (err) {
      res.send({
        status: false,
        message: "Internal Server Error, check internet",
      });
    } else {
      if (!user) {
        res
          .send({
            status: false,
            message: "Email not found, please register ",
          })
          .status(503);
      } else {
        user.validatePassword(password, (err, same) => {
          if (err) {
            res
              .send({
                status: false,
                message: "Incorrect Password",
              })
              .status(503);
          } else {
            if (!same) {
              res
                .send({
                  message: "Check again, your password is wrong",
                  status: false,
                })
                .status(444);
            } else {
              let secret = process.env.JWT_SECRET;
              let sessionToken = jwt.sign({ email }, secret);
              res
                .send({
                  message: "Sign in successful",
                  status: true,
                  sessionToken,
                })
                .status(200);
            }
          }
        });
      }
    }
  });
};

const eCommerceReg = (req, res) => {
  console.log(req.body);
  let form = new eCommerceUserModel(req.body);
  form.save((err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log(result);
      res
        .send({ message: "Account Successfully Created", status: true })
        .status(200);
    }
  });
};




const forgotPassword = (req, res) => {
  const { email } = req.body;
  console.log(req.body);

  eCommerceUserModel.find({ email: email }, (err, result) => {
    if (err) {
      console.log(err);
      res.send({ status: false, message: "Server Error", err });
    } else {
      if (!result) {
        res.send({
          status: false,
          message: "User not found, check email",
        });
      } else {
        console.log(result, "result");
        let {firstname} = result[0]
        let secret = process.env.JWT_SECRET;
        let resetToken = jwt.sign({ email }, secret, { expiresIn: 60 * 20 });
        let myMail = resetEmail(
          firstname,
          `${process.env.DEV_URL}/${resetToken}`
        );
        let mailObj = {
          receiver_mail: email,
          msg_subject: "Password Reset",
          message: myMail,
        };
        sendMail(mailObj);
        res.send({ status: true, message: "Check your mail for reset link " });
      }
    }
  });
};

const newPassword = (req, res) => {
  const { resetToken, password } = req.body;
  let secret = process.env.JWT_SECRET;

  jwt.verify(resetToken, secret, (err, result) => {
    if (err) {
      res.send({ status: false, message: "Invalid Token Please reset agin" });
    } else {
      console.log("verified succesfully")
      let userEmail = result.email
      eCommerceUserModel.findOne({ email: userEmail }, (err, user) => {
        console.log(user, "user");
        if (err) {
          res.send({
            status: false,
            message: "There has been an error, please try again later",
          });
        } else {
          console.log(result, "result")
          let saltround = 10;

          bcrypt.hash(password, saltround, (err, hashed) => {
            console.log(hashed, "hashed");

            if (hashed) {
              eCommerceUserModel.findOneAndUpdate(
                { _id: user._id },
                { password: hashed },
                (err, result) => {
                  if (err) {
                    console.log(err);
                  }
                  console.log(result, result);
                  res.send({status: true, message: "Password updated successfully"})
                }
              );
            }
          });
        }
      });
    }
  });
};


const getTransactionHistory = (req, res) => {
  console.log(req.body);

  eCommerceUserModel.find({ userID: req.body.userID }, (err, result) => {
    if (err) {
      res.send({
        status: false,
        message: "An error was encountered, please try again later",
      });
    } else {
      res.send({
        status: true,
        result,
        message: "All Transactions Details successfully collected",
      });
    }
  });
};

const getDashboard = (req, res) => {
  let secret = process.env.JWT_SECRET;
  let token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, secret, (err, result) => {
    if (err) {
      console.log(err);
      res.send({ status: false, message: "Try to Signin Again " });
    } else {
      let { email } = result;
      eCommerceUserModel.findOne({ email: email }, (err, userDetails) => {
        if (err) {
          res.send({
            status: false,
            message: "There has been an error please try logging in again",
          });
        } else {
          res
            .send({
              status: true,
              message: "User Authenticated Successfully",
              userDetails,
            })
            .status(200);
        }
      });
    }
  });
};

const transactions = (req, res) => {
  console.log(req.body);
  let form = new transactionModel(req.body);
  form.save((saved) => {
    res
      .send({ message: "Purchase made Successfully", status: true })
      .status(200);
  });
};

module.exports = {
  signin,
  getDashboard,
  eCommerceReg,
  getTransactionHistory,
  transactions,
  tester,
  forgotPassword,
  newPassword
};
