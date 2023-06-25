'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var productoShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania', required: true}, 
    sucursal: {type: Schema.ObjectId, ref: 'sucursal', required: true}, 
    almacen: {type: Schema.ObjectId, ref: 'almacen', required: true},
    tipo_producto: {type: Schema.ObjectId, ref: 'tipo_producto', required: true},
    clase_producto: {type: Schema.ObjectId, ref: 'clase_producto', required: true},
    unidad_medida_compra: {type: Schema.ObjectId, ref: 'unidad_medida', required: true},
    unidad_medida_venta: {type: Schema.ObjectId, ref: 'unidad_medida', required: true},
    unidad_medida_inventario: {type: Schema.ObjectId, ref: 'unidad_medida', required: true},
    lista_precio_venta: {type: Schema.ObjectId, ref: 'lista_precio', required: true},
    lista_precio_compra: {type: Schema.ObjectId, ref: 'lista_precio', required: true},
    itbis: {type: Schema.ObjectId, ref: 'itbis', required: true},
    descripcion: {type: String, required: true}, 
    cantidad_stock: {type: Number, required: true}, 
    cantidad_comprometida: {type: Number, required: true}, 
    cantidad_disponible: {type: Number, required: true}, 
    inventariable: {type: Boolean, required: true},
    estatus: {type: Boolean, required: true},
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
productoShema.plugin(autoIncrement.plugin, {model: 'producto', field: 'id', startAt: 1});
module.exports = mongoose.model('producto', productoShema);