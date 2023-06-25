'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var proveedorShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania'},  
    nombre: {type: String, required: true},
    descripcion: {type: String, required: false},
    vendedor: {type: Schema.ObjectId, ref: 'usuario', required: false},
    tipo_documento: {type: Schema.ObjectId, ref: 'tipo_documento', required: true},
    documento: {type: String, required: false},
    pagina_web: {type: String, required: false},  
    email: {type: String, required: false}, 
    telefono: {type: String, required: false},
    telefono1: {type: String, required: false},
    whatsapp: {type: String, required: false},
    fax: {type: String, required: false},
    moneda_curso: {type: Schema.ObjectId, ref: 'moneda', required: true},
    termino_pago: {type: Schema.ObjectId, ref: 'termino_pago', required: true},
    limite_credito: {type: Number, required: true},
    estatus: {type: Boolean, required: true},  
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
proveedorShema.plugin(autoIncrement.plugin, {model: 'proveedor', field: 'id', startAt: 1});
module.exports = mongoose.model('proveedor', proveedorShema);