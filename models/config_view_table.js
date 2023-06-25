'use strict'

var mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;

var configViewTableShema = Schema({
    id: {type: Number, autoIncrement: true, unique: true},
    compania: {type: Schema.ObjectId, ref: 'compania', required: true}, 
    modelo: {type: String, required: true},
    columns: [{type: Object, required: false}],
    initialState: [{type: Object, required: false}], 
    estatus: {type: Boolean, required: true},
    createdAt: {type: Date, default: Date.now, require:true},
});

autoIncrement.initialize(mongoose.connection);
configViewTableShema.plugin(autoIncrement.plugin, {model: 'config_view_table', field: 'id', startAt: 1});
module.exports = mongoose.model('config_view_table', configViewTableShema);