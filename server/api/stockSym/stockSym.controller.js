'use strict';

var _ = require('lodash');
var StockSym = require('./stockSym.model');

// Get list of stockSyms
exports.index = function(req, res) {
  StockSym.find(function (err, stockSyms) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(stockSyms);
  });
};

// Get a single stockSym
exports.show = function(req, res) {
  StockSym.findById(req.params.id, function (err, stockSym) {
    if(err) { return handleError(res, err); }
    if(!stockSym) { return res.status(404).send('Not Found'); }
    return res.json(stockSym);
  });
};

// Creates a new stockSym in the DB.
exports.create = function(req, res) {
  StockSym.create(req.body, function(err, stockSym) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(stockSym);
  });
};

// Updates an existing stockSym in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  StockSym.findById(req.params.id, function (err, stockSym) {
    if (err) { return handleError(res, err); }
    if(!stockSym) { return res.status(404).send('Not Found'); }
    _.extend(stockSym, req.body);
    stockSym.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(stockSym);
    });
  });
};

// Deletes a stockSym from the DB.
exports.destroy = function(req, res) {
  StockSym.findById(req.params.id, function (err, stockSym) {
    if(err) { return handleError(res, err); }
    if(!stockSym) { return res.status(404).send('Not Found'); }
    stockSym.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}