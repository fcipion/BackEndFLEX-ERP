'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var tipo_ingresoShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania', required: false}, 
    sucursal: {type: Schema.ObjectId, ref: 'sucursal', required: true},
    descripcion: {type: String, required: true}, 
    estatus: {type: Boolean, required: true},
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
tipo_ingresoShema.plugin(autoIncrement.plugin, {model: 'tipo_ingreso', field: 'id', startAt: 1});
module.exports = mongoose.model('tipo_ingreso', tipo_ingresoShema);