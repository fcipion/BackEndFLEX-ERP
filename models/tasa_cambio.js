'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var tasa_cambioShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania', required: true}, 
    moneda_from: {type: Schema.ObjectId, ref: 'moneda', required: true}, 
    moneda_to: {type: Schema.ObjectId, ref: 'moneda', required: true},
    value_from: {type: Number, required: true},
    value_to: {type: Number, required: true},
    fecha_from: {type: Date, required: true},
    fecha_to: {type: Date, required: true},
    estatus: {type: Boolean, required: true},
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
tasa_cambioShema.plugin(autoIncrement.plugin, {model: 'tasa_cambio', field: 'id', startAt: 1});
module.exports = mongoose.model('tasa_cambio', tasa_cambioShema);