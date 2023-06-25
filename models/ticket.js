'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var ticketShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania'}, 
    cliente: {type: Schema.ObjectId, ref: 'cliente'}, 
    code: {type: Number, required: true},
    fecha: {type: Date, default: Date.now, require:true},
    estatus: {type: Boolean, required: true},  
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
ticketShema.plugin(autoIncrement.plugin, {model: 'ticket', field: 'id', startAt: 1});
module.exports = mongoose.model('ticket', ticketShema);