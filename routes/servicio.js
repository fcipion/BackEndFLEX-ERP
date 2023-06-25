'use strict'

var express = require('express');

var ServicioController = require('../controllers/servicioController');

var api = express.Router();
var auth = require('../milddlewares/authenticate');
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir: './uploads/imagenes'});

//Ordenes de servicio 
api.post('/registro_orden_servicio',[auth.auth], ServicioController.registro_orden_servicio);
api.post(`/:id/upload-file-orden-service/:detailId`,[auth.auth, multiparty()], ServicioController.uploadFileRegisterOrderService);
api.get('/listar_orden_servicio',[auth.auth], ServicioController.listar_orden_servicio);
api.delete('/eliminar_orden_servicio/:id',auth.auth, ServicioController.eliminar_orden_servicio);
api.get('/listar_orden_servicio/:id',[auth.auth], ServicioController.obtener_orden_servicio);
api.put('/actualizar_orden_servicio/:id',[auth.auth,path], ServicioController.actualizar_orden_servicio);
api.get('/obtener_orden_servicio_img/:img', ServicioController.obtener_orden_servicio_img);

module.exports = api;