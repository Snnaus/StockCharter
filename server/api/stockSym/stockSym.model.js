'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StockSymSchema = new Schema({
  name: String,
  elem: {
    Symbol: String,
    Type: String,
    Params: Array
  }
});

module.exports = mongoose.model('StockSym', StockSymSchema);