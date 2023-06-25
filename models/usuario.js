'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var usuarioShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania', required: true}, 
    nombres: {type: String, required: false},
    descripcion: {type: String, required: false},
    apellidos: {type: String, required: false},
    email: {type: String, required: false},
    password: {type: String, required: false},
    telefono: {type: String, required: false},
    rol: {type: Schema.ObjectId, ref: 'rol'},
    vendedor: {type: Boolean, required: false},
    estatus: {type: Boolean, required: true},
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
usuarioShema.plugin(autoIncrement.plugin, {model: 'usuario', field: 'id', startAt: 1});
module.exports = mongoose.model('usuario', usuarioShema);