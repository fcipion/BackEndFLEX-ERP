'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var proceso_cajaShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania', required: true}, 
    sucursal: {type: Schema.ObjectId, ref: 'sucursal', required: true},
    caja: {type: Schema.ObjectId, ref: 'caja', required: true},
    turno: {type: Schema.ObjectId, ref: 'turno', required: true}, 
    usuario: {type: Schema.ObjectId, ref: 'usuario', required: true},   
    monto_apertura: {type: Number, required: true}, 
    monto_cierre: {type: Number, required: true}, 
    detalles: [{type: Object, required: false}],
    estatus: {type: Boolean, required: true},
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
proceso_cajaShema.plugin(autoIncrement.plugin, {model: 'proceso_caja', field: 'id', startAt: 1});
module.exports = mongoose.model('proceso_caja', proceso_cajaShema); 