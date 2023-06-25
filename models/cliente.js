'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var clienteShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania'}, 
    tipo_cliente: {type: Schema.ObjectId, ref: 'tipo_cliente', required: false}, 
    nombre: {type: String, required: true},
    descripcion: {type: String, required: true},
    vendedor: {type: Schema.ObjectId, ref: 'usuario', required: false},
    tipo_documento: {type: Schema.ObjectId, ref: 'tipo_documento', required: false},
    documento: {type: String, required: false},
    pagina_web: {type: String, required: false},  
    email: {type: String, required: false},
    fecha_nacimiento: {type: Date, required: false}, 
    lugar_nacimiento: {type: String, required: false}, 
    genero: {type: String, required: false},
    estado_civil: {type: String, required: false},    
    whatsapp: {type: String, required: false},
    telefono: {type: String, required: false},
    telefono1: {type: String, required: false},
    fax: {type: String, required: false},
    sector: {type: String, required: false},
    direccion: {type: String, required: false},
    moneda_curso: {type: Schema.ObjectId, ref: 'moneda', required: false},
    termino_pago: {type: Schema.ObjectId, ref: 'termino_pago', required: false},
    lista_precio: {type: Schema.ObjectId, ref: 'lista_precio', required: false},
    limite_credito: {type: Number, required: false},
    foto: {type: String, required: false}, 
    estatus: {type: Boolean, required: true},  
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
clienteShema.plugin(autoIncrement.plugin, {model: 'cliente', field: 'id', startAt: 1});
module.exports = mongoose.model('cliente', clienteShema);