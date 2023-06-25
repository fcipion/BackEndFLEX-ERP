'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var claseMovimientoShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania', required: true}, 
    tipo_movimiento: {type: String, required: true},
    code: {type: String, required: false}, 
    descripcion: {type: String, required: true}, 
    estatus: {type: Boolean, required: true},
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
claseMovimientoShema.plugin(autoIncrement.plugin, {model: 'clase_movimiento', field: 'id', startAt: 1});
module.exports = mongoose.model('clase_movimiento', claseMovimientoShema);