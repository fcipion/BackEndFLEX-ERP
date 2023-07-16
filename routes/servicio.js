'use strict'

var express = require('express');

var ServicioController = require('../controllers/servicioController');

var api = express.Router();
var auth = require('../milddlewares/authenticate');
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir: './uploads/imagenes'});

api.post(`/:orderId/upload-file-orden-service/:customName/request`, [auth.auth], ServicioController.requestFileRegisterOrderService);
api.get(`/:orderId/upload-file-orden-service/:customName/status`, [auth.auth], ServicioController.statusFileRegisterOrderService);
api.post(`/:orderId/upload-file-orden-service/:customName`, [auth.auth], ServicioController.uploadFileRegisterOrderService)

//Ordenes de servicio 
api.post('/registro_orden_servicio',[auth.auth], ServicioController.registro_orden_servicio);
api.get('/listar_orden_servicio',[auth.auth], ServicioController.listar_orden_servicio);
api.delete('/eliminar_orden_servicio/:id',auth.auth, ServicioController.eliminar_orden_servicio);
api.get('/listar_orden_servicio/:id',[auth.auth], ServicioController.obtener_orden_servicio);
api.put('/actualizar_orden_servicio/:id',[auth.auth], ServicioController.actualizar_orden_servicio);
api.get('/obtener_orden_servicio_img/:orderId/:img', ServicioController.obtener_orden_servicio_img);
api.get('/obtener_orden_servicio_img/:orderId/:img/download', ServicioController.downloadFileRegisterOrderService);
api.post('/order/visor-files', ServicioController.getOrderFileVisor);

module.exports = api;