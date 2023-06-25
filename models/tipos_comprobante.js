'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var tipos_comprobantesShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania', required: true}, 
    tipo: {type: String, required: true},
    descripcion: {type: String, required: true},
    estatus: {type: Boolean, required: true},
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
tipos_comprobantesShema.plugin(autoIncrement.plugin, {model: 'tipos_comprobante', field: 'id', startAt: 1});
module.exports = mongoose.model('tipos_comprobante', tipos_comprobantesShema);