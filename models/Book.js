
// models/Book.js
const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: String,
  genre: String,
  publishedYear: Number,
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("Book", BookSchema);
