const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required : [true, 'username is required']
  },
  password: {
    type: String,
    required : [true , 'password requiered']
  }
})

//add a static model-method to check if the credentials are valid
userSchema.statics.findAndValidate = async function (username, password) {
  const foundUser = await this.findOne({'username' : username});
  const isUser = await bcrypt.compare(password, foundUser.password);
  return isUser ? foundUser : null ; 
}


userSchema.pre("save", async function (next) {
  if (! this.isModified('password')) return next(); 
  this.password = await  bcrypt.hash(this.password, 12);
  next();
})

module.exports = mongoose.model("User" , userSchema);