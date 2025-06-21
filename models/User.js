const mongoose = require('mongoose')
const bcrypt =require('bcryptjs')
<<<<<<< Updated upstream
//const User = require("../models/User")
=======

>>>>>>> Stashed changes

//const jwt = require('jsonwebtoken')
const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required: [true, 'Please provide name'],
    minlength:3,
    maxlength:50,
  },
   email:{
    type:String,
    required: [true, 'Please provide email'],
    
   //get this from readme file 
   match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
    unique: true,
  },
   password:{
    type:String,
    required: [true, 'Please provide password'],
    minlength:6,
    
  },
})
<<<<<<< Updated upstream
//hash password before saving
UserSchema.pre('save', async function () {
=======
userSchema.pre('save', async function () {
>>>>>>> Stashed changes
  
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);


  
  

})
// Add comparePassword method for login
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

//  Password comparison method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};






module.exports = mongoose.model('User', userSchema)