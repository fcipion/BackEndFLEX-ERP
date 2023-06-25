'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var lista_precioShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania', required: true}, 
    sucursal: {type: Schema.ObjectId, ref: 'sucursal', required: true}, 
    descripcion: {type: String, required: true}, 
    estatus: {type: Boolean, required: true},
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
lista_precioShema.plugin(autoIncrement.plugin, {model: 'lista_precio', field: 'id', startAt: 1});
module.exports = mongoose.model('lista_precio', lista_precioShema);