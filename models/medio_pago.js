'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var mediopagoShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania', required: true}, 
    sucursal: {type: Schema.ObjectId, ref: 'sucursal', required: true},
    code: {type: String, required: true},  
    descripcion: {type: String, required: true}, 
    imagen: {type: String, required: false},
    estatus: {type: Boolean, required: true},
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
mediopagoShema.plugin(autoIncrement.plugin, {model: 'medio_pago', field: 'id', startAt: 1});
module.exports = mongoose.model('medio_pago', mediopagoShema);