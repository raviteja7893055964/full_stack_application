const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  inventory: Number,
});

module.exports = mongoose.model('Product', productSchema);