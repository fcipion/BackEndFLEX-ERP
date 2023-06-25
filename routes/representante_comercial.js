'use strict'

var express = require('express');

var RepresentanteComercialController = require('../controllers/representanteComercialController');

var api = express.Router();
var auth = require('../milddlewares/authenticate');
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir: './uploads/representante_comercial'});
var pathExcel = multiparty({uploadDir: './uploads/excel'});


api.post('/subir_plantilla_doctor',[auth.auth,pathExcel], RepresentanteComercialController.subir_plantilla_doctor);

//Clientes
api.post('/registro_cliente',[auth.auth], RepresentanteComercialController.registro_cliente);
api.get('/listar_cliente',[auth.auth], RepresentanteComercialController.listar_cliente);
api.delete('/eliminar_cliente/:id',auth.auth, RepresentanteComercialController.eliminar_cliente);
api.get('/listar_cliente/:id',[auth.auth], RepresentanteComercialController.obtener_cliente);
api.put('/actualizar_cliente/:id',[auth.auth], RepresentanteComercialController.actualizar_cliente);

//Proveedores
api.post('/registro_proveedor',[auth.auth], RepresentanteComercialController.registro_proveedor);
api.get('/listar_proveedor',[auth.auth], RepresentanteComercialController.listar_proveedor);
api.delete('/eliminar_proveedor/:id',auth.auth, RepresentanteComercialController.eliminar_proveedor);
api.get('/listar_proveedor/:id',[auth.auth], RepresentanteComercialController.obtener_proveedor);
api.put('/actualizar_proveedor/:id',[auth.auth], RepresentanteComercialController.actualizar_proveedor);

//Doctor
api.post('/registro_doctor',[auth.auth], RepresentanteComercialController.registro_doctor);
api.get('/listar_doctor',[auth.auth], RepresentanteComercialController.listar_doctor);
api.delete('/eliminar_doctor/:id',auth.auth, RepresentanteComercialController.eliminar_doctor);
api.get('/listar_doctor/:id',[auth.auth], RepresentanteComercialController.obtener_doctor);
api.put('/actualizar_doctor/:id',[auth.auth], RepresentanteComercialController.actualizar_doctor);


module.exports = api;