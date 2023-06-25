'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var rango_comprobanteShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania', required: true}, 
    tipos_comprobante: {type: Schema.ObjectId, ref: 'tipos_comprobante', required: true}, 
    inicial: {type: String, required: true},
    limite_inferior: {type: Number, required: true},
    limite_superior: {type: Number, required: true},
    estatus: {type: Boolean, required: true},
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
rango_comprobanteShema.plugin(autoIncrement.plugin, {model: 'rango_comprobante', field: 'id', startAt: 1});
module.exports = mongoose.model('rango_comprobante', rango_comprobanteShema);