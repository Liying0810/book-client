const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  authors: [String],
  description: String,
  thumbnail: String,
  note: String,
});

module.exports = mongoose.model('Book', bookSchema);
