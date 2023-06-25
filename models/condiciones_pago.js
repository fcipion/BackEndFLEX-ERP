'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var condiciones_pagoShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania', required: true}, 
    descripcion: {type: String, required: true}, 
    estatus: {type: Boolean, required: true},
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
condiciones_pagoShema.plugin(autoIncrement.plugin, {model: 'condiciones_pago', field: 'id', startAt: 1});
module.exports = mongoose.model('condiciones_pago', condiciones_pagoShema);