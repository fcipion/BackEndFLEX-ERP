'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var estadoShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania'},
    code: {type: String, required: true},
    descripcion: {type: String, required: true},
    estatus: {type: Boolean, required: true},
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
estadoShema.plugin(autoIncrement.plugin, {model: 'estado', field: 'id', startAt: 1});
module.exports = mongoose.model('estado', estadoShema);