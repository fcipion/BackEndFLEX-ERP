'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PaginaShema = Schema({
    descripcion: {type: String, required: true},
    order: {type: Number, required: true},
    code: {type: String, required: true},
    icono: {type: String, required: true},
    modulo: {type: Schema.ObjectId, ref: 'modulo', required: true}, 
    createdAt: {type: Date, default: Date.now, require:true},
});

module.exports = mongoose.model('pagina', PaginaShema);