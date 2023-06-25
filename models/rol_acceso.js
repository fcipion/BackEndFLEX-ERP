'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var rol_accesoShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania'}, 
    rolShema: {type: Schema.ObjectId, ref: 'rol', required: true}, 
    modulo: {type: Schema.ObjectId, ref: 'modulo', required: true},
    pagina: {type: Schema.ObjectId, ref: 'pagina', required: true},
    acceso: [{type: Object, required: false}], 
    estatus: {type: Boolean, required: true},  
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
rol_accesoShema.plugin(autoIncrement.plugin, {model: 'rol_acceso', field: 'id', startAt: 1});
module.exports = mongoose.model('rol_acceso', rol_accesoShema);