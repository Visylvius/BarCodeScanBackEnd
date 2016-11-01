var mongoose = require('mongoose');

var productCodes = mongoose.Schema({
  product_name: String,
  upc: String
});

module.exports = mongoose.model('UPC', productCodes);
