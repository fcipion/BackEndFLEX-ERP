'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var termino_pagoShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania', required: true}, 
    descripcion: {type: String, required: true},
    dias: {type: Number, required: true}, 
    estatus: {type: Boolean, required: true},
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
termino_pagoShema.plugin(autoIncrement.plugin, {model: 'termino_pago', field: 'id', startAt: 1});
module.exports = mongoose.model('termino_pago', termino_pagoShema);