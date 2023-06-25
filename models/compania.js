'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var companiaShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    nombre: {type: String, required: true},
    descripcion: {type: String, required: true},
    rnc: {type: String, required: false},
    direccion: {type: String, required: false},
    email: {type: String, required: false},
    telefono: {type: String, required: false},
    celular: {type: String, required: false},
    whatsapp: {type: String, required: false},
    mision: {type: String, required: false},
    vision: {type: String, required: false},
    valores: {type: String, required: false},
    estatus: {type: Boolean, required: false},
    fecha_establecida: {type: Date, require:false},
    logo: {type: String, required: false},  
    sitio_web: {type: String, required: false},
    moneda_curso: {type: Schema.ObjectId, ref: 'moneda', required: false},
    moneda_paralela: {type: Schema.ObjectId, ref: 'moneda', required: false},   
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
companiaShema.plugin(autoIncrement.plugin, {model: 'compania', field: 'id', startAt: 1});
module.exports = mongoose.model('compania', companiaShema);