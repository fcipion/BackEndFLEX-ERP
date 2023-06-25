'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var rolShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania'}, 
    descripcion: {type: String, required: true},
    estatus: {type: Boolean, required: true},  
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
rolShema.plugin(autoIncrement.plugin, {model: 'rol', field: 'id', startAt: 1});
module.exports = mongoose.model('rol', rolShema);