'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var idiomaShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania'},
    id: {type: Number, required: false}, 
    code: {type: String, required: true},
    descripcion: {type: String, required: true},
    estatus: {type: Boolean, required: true},
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
idiomaShema.plugin(autoIncrement.plugin, {model: 'idioma', field: 'id', startAt: 1});
module.exports = mongoose.model('idioma', idiomaShema);