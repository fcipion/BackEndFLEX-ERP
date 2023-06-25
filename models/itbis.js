'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var itbis_detalleShema = Schema({
    line_id: {type: Number, required: true},
    tipo_itbis: {type: Schema.ObjectId, ref: 'tipo_itbis', required: true},
    cuentaContable: {type: String, required: true},
});

autoIncrement.initialize(mongoose.connection);
itbis_detalleShema.plugin(autoIncrement.plugin, {model: 'itbis_detall', field: 'id', startAt: 1});

var itbisShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania', required: true},
    sucursal: {type: Schema.ObjectId, ref: 'sucursal', required: true}, 
    descripcion: {type: String, required: true},
    code: {type: String, required: true},
    detalles: [itbis_detalleShema],
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
itbisShema.plugin(autoIncrement.plugin, {model: 'itbis', field: 'id', startAt: 1});
module.exports = mongoose.model('itbis', itbisShema);