'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var cuentaContableShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania'},
    sucursal: {type: Schema.ObjectId, ref: 'sucursal', required: true}, 
    cuenta: {type: String, required: true},
    descripcion: {type: String, required: true},
    cuenta_padre: {type: Schema.ObjectId, ref: 'cuenta_contable', required: false},
    estatus: {type: Boolean, required: true},
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
cuentaContableShema.plugin(autoIncrement.plugin, {model: 'cuenta_contable', field: 'id', startAt: 1});
module.exports = mongoose.model('cuenta_contable', cuentaContableShema);