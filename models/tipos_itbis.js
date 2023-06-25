'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var tipoItbisShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania', required: true},
    code: {type: String, required: true}, 
    descripcion: {type: String, required: true},
    porcentaje: {type: Number, required: true},
    estatus: {type: Boolean, required: true},
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
tipoItbisShema.plugin(autoIncrement.plugin, {model: 'tipo_itbis', field: 'id', startAt: 1});
module.exports = mongoose.model('tipo_itbis', tipoItbisShema);