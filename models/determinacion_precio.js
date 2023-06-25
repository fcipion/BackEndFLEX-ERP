'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var lista_precio_detalleShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    producto: {type: Schema.ObjectId, ref: 'producto', required: true},
    moneda: {type: Schema.ObjectId, ref: 'moneda', required: true},
    unidad_medida: {type: Schema.ObjectId, ref: 'unidad_medida', required: true},
    precio: {type: Number, required: true},
});

autoIncrement.initialize(mongoose.connection);
lista_precio_detalleShema.plugin(autoIncrement.plugin, {model: 'lista_precio_detalle', field: 'id', startAt: 1});

var determinacionPrecioShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania', required: true}, 
    sucursal: {type: Schema.ObjectId, ref: 'sucursal', required: true},
    lista_precio: {type: Schema.ObjectId, ref: 'lista_precio', required: true},  
    descripcion: {type: String, required: true},
    detalles: [lista_precio_detalleShema], 
    estatus: {type: Boolean, required: true},
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
determinacionPrecioShema.plugin(autoIncrement.plugin, {model: 'determinacion_precio', field: 'id', startAt: 1});
module.exports = mongoose.model('determinacion_precio', determinacionPrecioShema);