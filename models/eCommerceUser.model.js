const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

const eCommerceUser = mongoose.Schema({
    firstname: {type:String, required:true},
    lastname: {type:String, required:true},
    email: {type:String, unique:true, required:true},
    password:{type:String},
    

})
let saltround = 8;
eCommerceUser.pre("save", function (next) {
  bcrypt.hash(this.password, saltround, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      this.password = result;
      next();
    }
  });
});

eCommerceUser.methods.validatePassword = function (password, callback) {
  
  console.log(password);
  bcrypt.compare(password, this.password, (err, same) => {
    if (!err) {
      callback(err, same);
    } else {
      next();
    }
  });
};
const eCommerceUserModel = mongoose.model("eCommerceUser", eCommerceUser)

module.exports = eCommerceUserModel 