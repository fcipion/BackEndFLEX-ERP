'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var tipo_documentoShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania', required: true}, 
    descripcion: {type: String, required: true}, 
    estatus: {type: Boolean, required: true},
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
tipo_documentoShema.plugin(autoIncrement.plugin, {model: 'tipo_documento', field: 'id', startAt: 1});
module.exports = mongoose.model('tipo_documento', tipo_documentoShema);