'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var log_itemShema = Schema({
    id: {type: String, required: true},
    changes: [{type: Object, required: true}],
});

module.exports = mongoose.model('log_item', log_itemShema);