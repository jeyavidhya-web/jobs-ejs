const mongoose = require('mongoose') //
const BookSchema = new mongoose.Schema({
 
   
  
  title: {
    type: String,
    required: [true, 'Please provide the book title'],
    maxlength: 100,
  },
  author: {
    type: String,
    required: [true, 'Please provide the author name'],
    maxlength: 100,
  },
  genre: {
    type: String,
    required: [true, 'Please provide a genre'],
    maxlength: 50,
  },
  status: {
    type: String,
    enum: ['available', 'borrowed', 'reserved'],
    default: 'available',
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide the user'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Book', BookSchema);
