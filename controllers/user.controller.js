const eCommerceUserModel = require("../models/eCommerceUser.model");

const transactionModel = require("../models/transactions.model")

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
            message: "Invalid Email",
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
                  id: user._id,
                })
                .status(200);
            }
          }
        });
      }
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
          res.send({
            status: true,
            message: "User Authenticated Successfully",
            userDetails,
          }).status(200);
        }
      });
    }
  });
};

const eCommerceReg = (req, res) => {
  console.log(req.body);
  let { firstname, lastname, email, password } = req.body;

  let form = new eCommerceUserModel(req.body);
  form.save().then((saved) => {
    if(saved){
      res
        .send({ message: "Account Successfully Created", status: true, saved })
        .status(200);

    }else{
      res.send({status:false, message:"There was an error"})
    }
  }).catch(err=>{
    res.send({message: "This is a catch error"})
  });
};

const transactions =(req, res)=>{
  console.log(req.body)
  let form = new transactionModel(req.body)
  form.save((saved)=>{
    res.send({message: "Purchase made Successfully", status: true}).status(200)
  })
}

const getTransactionHistory =(req, res)=>{
  console.log(req.body)
  
  eCommerceUserModel.find({_id:req.body.userID}, (err, result)=>{
    if(err){
      res.send({status:false, message: "An error was encountered, please try again later"})
    }else{
      res.send({status: true, result, message:"All Transactions Details successfully collected"})
    }
  })
}

module.exports = { signin, getDashboard, eCommerceReg, getTransactionHistory, transactions };
