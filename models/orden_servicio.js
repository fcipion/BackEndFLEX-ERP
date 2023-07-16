'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var ordenServicioDetalleShema = Schema({
    line_id: {type: Number, required: true},
    producto: {type: Schema.ObjectId, ref: 'producto', required: true},
    unidad_medida: {type: Schema.ObjectId, ref: 'unidad_medida', required: true},
    cantidad: {type: Number, required: true},
    almacen: {type: Schema.ObjectId, ref: 'almacen', required: true}, 
    estado: {type: Schema.ObjectId, ref: 'estado', required: true},
    galeria: [{type: Object, required: false}],
    comentarios: {type: String, required: true},
    uuid: {type: String, required: true},
    repetida: {type: Boolean, required: true},
    estatus: {type: Boolean, required: true},
});

var ordenServicioShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania', required: true},
    sucursal: {type: Schema.ObjectId, ref: 'sucursal', required: true},
    cliente: {type: Schema.ObjectId, ref: 'cliente', required: true},
    doctor: {type: Schema.ObjectId, ref: 'doctor', required: true},
    vendedor: {type: Schema.ObjectId, ref: 'usuario', required: true},  
    fecha: {type: Date, default: Date.now, require:true},
    fecha_contabilizacion: {type: Date, default: Date.now, require:true},
    fecha_vencimiento: {type: Date, default: Date.now, require:true},
    fecha_compromiso: {type: Date, default: Date.now, require:true},
    comentarios: {type: String, required: false}, 
    detalles: [ordenServicioDetalleShema],
    estatus: {type: Boolean, required: true},
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
ordenServicioShema.plugin(autoIncrement.plugin, {model: 'orden_servicio', field: 'id', startAt: 1});
module.exports = mongoose.model('orden_servicio', ordenServicioShema);