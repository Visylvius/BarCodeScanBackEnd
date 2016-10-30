var mongoose = require('mongoose');

var upcCodeSchema = mongoose.Schema({
  upc: [{
    product_name: String,
    upc: String
  }]
});

module.exports = mongoose.model('UPC', upcCodeSchema);
