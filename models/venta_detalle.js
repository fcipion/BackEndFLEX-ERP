'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var ventaDetalleShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    line_id: {type: Number, required: true},
    producto: {type: Schema.ObjectId, ref: 'producto', required: true}, 
    cantidad: {type: Number, required: true}, 
    almacen: {type: Schema.ObjectId, ref: 'almacen', required: false},
    lista_precio: {type: Schema.ObjectId, ref: 'lista_precio', required: false}, 
    precio: {type: Number, required: true},
    itbis: {type: Schema.ObjectId, ref: 'itbis', required: false},
    total_itbis: {type: Number, required: true}, 
    total_line: {type: Number, required: true},
    totalAntesDescuentos: {type: Number, required: true},
    totalTrasDescuentos: {type: Number, required: true},
    totalSinItbis: {type: Number, required: true},
    totalConItbis: {type: Number, required: true},
    descuento_linea: {type: Number, required: false},
    unidad_medida: {type: Schema.ObjectId, ref: 'unidad_medida', required: true},
    venta: {type: Schema.ObjectId, ref: 'venta', required: true}, 
    estatus: {type: Boolean, required: true},
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
ventaDetalleShema.plugin(autoIncrement.plugin, {model: 'venta_detalle', field: 'id', startAt: 1});
module.exports = mongoose.model('venta_detalle', ventaDetalleShema);