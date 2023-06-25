'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var pago_factura_detalleShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    venta: {type: Schema.ObjectId, ref: 'venta', required: true},
    moneda: {type: Schema.ObjectId, ref: 'moneda', required: true},
    importeAplicado: {type: Number, required: true},
    descuentos: {type: Number, required: false},
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
pago_factura_detalleShema.plugin(autoIncrement.plugin, {model: 'pago_factura_detalle', field: 'id', startAt: 1});

var pagoFacturaShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania', required: true}, 
    cliente: {type: Schema.ObjectId, ref: 'cliente', required: true}, 
    importe: {type: Number, required: true},
    detalles: [pago_factura_detalleShema], 
    estatus: {type: Boolean, required: true},
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
pagoFacturaShema.plugin(autoIncrement.plugin, {model: 'pago_factura', field: 'id', startAt: 1});
module.exports = mongoose.model('pago_factura', pagoFacturaShema);