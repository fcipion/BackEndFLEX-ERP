'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var unidad_medidaShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania', required: true}, 
    codigo: {type: String, required: true}, 
    descripcion: {type: String, required: true}, 
    estatus: {type: Boolean, required: true},
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
unidad_medidaShema.plugin(autoIncrement.plugin, {model: 'unidad_medida', field: 'id', startAt: 1});
module.exports = mongoose.model('unidad_medida', unidad_medidaShema);