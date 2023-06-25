'use strict'

var express = require('express');
var GeneralController = require('../controllers/generalController');

var api = express.Router();
var auth = require('../milddlewares/authenticate');
var multiparty = require('connect-multiparty');
var path_company = multiparty({uploadDir: './uploads/companias'});

//Menu 
api.get('/listar_menu',[auth.auth], GeneralController.listar_menu);
api.get('/listar_menu_mobile',[auth.auth], GeneralController.listar_menu_mobile);

//config_view_table 
api.post('/registro_config_view_table',[auth.auth], GeneralController.registro_config_view_table);
api.get('/listar_config_view_table',[auth.auth], GeneralController.listar_config_view_table);
api.delete('/eliminar_config_view_table/:id',auth.auth, GeneralController.eliminar_config_view_table);
api.get('/listar_config_view_table/:pagina',[auth.auth], GeneralController.obtener_config_view_table);
api.put('/actualizar_config_view_table/:id',[auth.auth], GeneralController.actualizar_config_view_table);

//consultar_cedula 
api.get('/consultar_cedula/:cedula?',[auth.auth], GeneralController.consultar_cedula);

//crear_ticket
api.post('/crear_ticket',[auth.auth], GeneralController.crear_ticket);
api.get('/listar_ticket',[auth.auth], GeneralController.listar_ticket);

//guardar_cliente_dispositivo
api.post('/guardar_cliente_dispositivo',[auth.auth], GeneralController.guardar_cliente_dispositivo);

//Consultar log 
api.get('/consultar_log/:id',[auth.auth], GeneralController.consultar_log);
module.exports = api;