'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var configViewRegistroShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania', required: true},
    usuario: {type: Schema.ObjectId, ref: 'usuario', required: false}, 
    modelo: {type: String, required: true},
    campos: [{type: Object, required: false}], 
    estatus: {type: Boolean, required: true},
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
configViewRegistroShema.plugin(autoIncrement.plugin, {model: 'config_view_registro', field: 'id', startAt: 1});
module.exports = mongoose.model('config_view_registro', configViewRegistroShema);