'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var logShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    modelo: {type: String, required: true},
    compania: {type: Schema.ObjectId, ref: 'compania', required: true}, 
    log_item: {type: Schema.ObjectId, ref: 'log_item', required: true}
});

autoIncrement.initialize(mongoose.connection);
logShema.plugin(autoIncrement.plugin, {model: 'log', field: 'id', startAt: 1});
module.exports = mongoose.model('log', logShema);