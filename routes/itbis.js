'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var itbisDetalleShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    code: {type: String, required: true},
    porcentaje: {type: Number, required: true},
    cuentaContable: {type: String, required: true},
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
itbisDetalleShema.plugin(autoIncrement.plugin, {model: 'itbisDetalleShema', field: 'id', startAt: 1});

var itbisShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania', required: true}, 
    descripcion: {type: String, required: true},
    detalles: [itbisDetalleShema],
    estatus: {type: Boolean, required: true},
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
itbisShema.plugin(autoIncrement.plugin, {model: 'itbis', field: 'id', startAt: 1});
module.exports = mongoose.model('itbis', itbisShema);