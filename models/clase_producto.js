'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var clase_productoShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania', required: true}, 
    descripcion: {type: String, required: true}, 
    estatus: {type: Boolean, required: true},
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
clase_productoShema.plugin(autoIncrement.plugin, {model: 'clase_producto', field: 'id', startAt: 1});
module.exports = mongoose.model('clase_producto', clase_productoShema);