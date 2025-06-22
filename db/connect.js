const mongoose = require('mongoose')

<<<<<<< HEAD
const connectDB =  (url) => {
  return mongoose.connect(url);

}

module.exports = connectDB;
=======
const connectDB = (url) => {
  return mongoose.connect(url, {
    useNewUrlParser: true,
    
    useUnifiedTopology: true,
  })
}

module.exports = connectDB
>>>>>>> origin/lesson12
