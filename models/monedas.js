'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var monedasShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania'}, 
    simbolo: {type: String, required: true}, 
    descripcion: {type: String, required: true},
    estatus: {type: Boolean, required: true},
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
monedasShema.plugin(autoIncrement.plugin, {model: 'moneda', field: 'id', startAt: 1});

module.exports = mongoose.model('moneda', monedasShema);