const mongoose = require('mongoose')
const bcrypt =require('bcryptjs')
<<<<<<< HEAD
//const User = require("../models/User")
=======
const User = require("../models/User");
>>>>>>> origin/lesson12

//const jwt = require('jsonwebtoken')
const UserSchema = new mongoose.Schema({
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
<<<<<<< HEAD
//hash password before saving
=======
>>>>>>> origin/lesson12
UserSchema.pre('save', async function () {
  
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

<<<<<<< HEAD

  
  

})
// Add comparePassword method for login
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
=======
  

})
>>>>>>> origin/lesson12






module.exports = mongoose.model('User', UserSchema)