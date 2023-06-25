'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var sucursalShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania'}, 
    descripcion: {type: String, required: false},
    telefono: {type: String, required: false},
    celular: {type: String, required: false},
    whatsapp: {type: String, required: false},
    direccion: {type: String, required: false},
    estatus: {type: Boolean, required: true},  
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
sucursalShema.plugin(autoIncrement.plugin, {model: 'sucursal', field: 'id', startAt: 1});
module.exports = mongoose.model('sucursal', sucursalShema);