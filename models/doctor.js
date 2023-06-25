'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var doctorShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania', required: true}, 
    nombre: {type: String, required: true},
    descripcion: {type: String, required: false},
    tipo_documento: {type: Schema.ObjectId, ref: 'tipo_documento', required: false},
    documento: {type: String, required: false},
    pagina_web: {type: String, required: false},  
    email: {type: String, required: false}, 
    telefono: {type: String, required: false},
    telefono1: {type: String, required: false},
    fax: {type: String, required: false},
    estatus: {type: Boolean, required: true},  
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
doctorShema.plugin(autoIncrement.plugin, {model: 'doctor', field: 'id', startAt: 1});
module.exports = mongoose.model('doctor', doctorShema);