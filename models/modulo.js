'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ModuloShema = Schema({
    descripcion: {type: String, required: true},
    order: {type: Number, required: true},
    icono: {type: String, required: true}, 
    createdAt: {type: Date, default: Date.now, require:true},
});

module.exports = mongoose.model('modulo', ModuloShema);