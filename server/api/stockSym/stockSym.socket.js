/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var StockSym = require('./stockSym.model');

exports.register = function(socket) {
  StockSym.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  StockSym.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('stockSym:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('stockSym:remove', doc);
}