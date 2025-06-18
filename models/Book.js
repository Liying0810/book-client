const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
title: { type: String, required: true },
authors: { type: [String], required: true },
  description: String,
  thumbnail: String,
  note: String,
});

module.exports = mongoose.model('Book', bookSchema);
