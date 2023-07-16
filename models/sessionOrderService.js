'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var sessionOrderServiceShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    uuid: {type: String, required: true}, 
    password: {type: String, required: true},
    ordenServiceId: {type: String, required: true},
    token: {type: String, required: false},
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
sessionOrderServiceShema.plugin(autoIncrement.plugin, {model: 'sessionOrderService', field: 'id', startAt: 1});
module.exports = mongoose.model('sessionOrderService', sessionOrderServiceShema);