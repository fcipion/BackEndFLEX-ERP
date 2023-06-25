'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var ventaShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania', required: true}, 
    sucursal: {type: Schema.ObjectId, ref: 'sucursal', required: true}, 
    cliente: {type: Schema.ObjectId, ref: 'cliente', required: true},
    vendedor: {type: Schema.ObjectId, ref: 'usuario', required: true}, 
    caja: {type: Schema.ObjectId, ref: 'caja', required: true},
    doctor: {type: Schema.ObjectId, ref: 'doctor', required: false},
    estado: {type: String, required: false},
    totalPendiente: {type: Number, required: false},
    subtotal: {type: Number, required: true},
    total: {type: Number, required: true},
    descuentosCB: {type: Number, required: true},
    montoAplicado: {type: Number, required: true},
    itbis: {type: Number, required: true},
    totalDescuentos: {type: Number, required: true},
    fecha_vencimiento: {type: Date, required: true},
    fecha_contabilizacion: {type: Date, required: true},
    comentarios: {type: String, required: false}, 
    moneda: {type: Schema.ObjectId, ref: 'moneda', required: true},
    tipo_cambio: {type: Schema.ObjectId, ref: 'tasa_cambio', required: true},
    condicion_pago: {type: Schema.ObjectId, ref: 'condiciones_pago', required: true},
    tipo_comprobante: {type: Schema.ObjectId, ref: 'tipos_comprobante', required: false},
    ncf: {type: String, required: false},
    fecha_vencimiento_ncf: {type: Date, required: false}, 
    rnc: {type: String, required: false},
    tipo_ingreso: {type: Schema.ObjectId, ref: 'tipo_ingreso', required: true},
    medio_pago: {type: Schema.ObjectId, ref: 'medio_pago', required: true},
    proceso_medio_pago: {type: Array, required: true}, 
    detalles: {type: Array, required: true}, 
    reporte: {type: Boolean, required: true},
    estatus: {type: Boolean, required: true},
    nota_debito: {type: Boolean, required: true},
    cancelada: {type: Boolean, default: false, required: true},
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
ventaShema.plugin(autoIncrement.plugin, {model: 'venta', field: 'id', startAt: 1});
module.exports = mongoose.model('venta', ventaShema);