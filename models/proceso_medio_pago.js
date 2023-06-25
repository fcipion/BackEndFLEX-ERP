'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var datos_tarjetaShema = Schema({
    cuenta: {type: Schema.ObjectId, ref: 'cuenta_contable', required: false},
    tarjeta: {type: Schema.ObjectId, ref: 'tarjeta', required: false},
    numero: {type: String, required: false},
    propietario: {type: String, required: false},
    monto: {type: Number, required: false},
    fecha: {type: Date, default: Date.now, require:false},
});

var datos_chequeShema = Schema({
    cuenta: {type: Schema.ObjectId, ref: 'cuenta_contable', required: false},
    banco: {type: Schema.ObjectId, ref: 'banco', required: false},
    numero: {type: String, required: false},
    monto: {type: Number, required: false},
    fecha: {type: Date, default: Date.now, require:false},
});

var datos_efectivo = Schema({
    cuenta: {type: Schema.ObjectId, ref: 'cuenta_contable', required: false},
    monto: {type: Number, required: false},
    fecha: {type: Date, default: Date.now, require:false},
});

var procesoMedioPagoShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania', required: true}, 
    venta: {type: Schema.ObjectId, ref: 'venta', required: true}, 
    datos_efectivo: [datos_efectivo],
    datos_tarjeta: [datos_tarjetaShema],
    datos_cheque: [datos_chequeShema],
    fecha: {type: Date, default: Date.now, require:true},
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
procesoMedioPagoShema.plugin(autoIncrement.plugin, {model: 'procesoMedioPago', field: 'id', startAt: 1});
module.exports = mongoose.model('procesoMedioPago', procesoMedioPagoShema);