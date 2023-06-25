'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var movimientoMercanciaDetalleShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    almacen: {type: Schema.ObjectId, ref: 'almacen', required: false},
    producto: {type: Schema.ObjectId, ref: 'producto', required: true},
    cantidad: {type: Number, required: true},
    precio: {type: Number, required: true},
    fecha: {type: Date, default: Date.now, require:true},
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
movimientoMercanciaDetalleShema.plugin(autoIncrement.plugin, {model: 'movimientoMercanciaDetalle', field: 'id', startAt: 1});

var movimientoMercanciaShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania', required: true}, 
    sucursal: {type: Schema.ObjectId, ref: 'sucursal', required: true}, 
    clase_movimiento: {type: Schema.ObjectId, ref: 'clase_movimiento', required: true},
    documento: {type: String, required: false},
    detalles: [movimientoMercanciaDetalleShema],
    fecha: {type: Date, default: Date.now, require:true},
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
movimientoMercanciaShema.plugin(autoIncrement.plugin, {model: 'movimientoMercancia', field: 'id', startAt: 1});
module.exports = mongoose.model('movimientoMercancia', movimientoMercanciaShema);