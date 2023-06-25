'use strict'

var express = require('express');

var VentaController = require('../controllers/ventaController');

var api = express.Router();
var auth = require('../milddlewares/authenticate');
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir: './uploads/representante_comercial'});

//Venta
api.post('/registro_venta',[auth.auth], VentaController.registro_venta);
api.get('/listar_venta',[auth.auth], VentaController.listar_venta);
api.delete('/eliminar_venta/:id',auth.auth, VentaController.eliminar_venta);
api.get('/listar_venta/:id',[auth.auth], VentaController.obtener_venta);
api.put('/actualizar_venta/:id',[auth.auth], VentaController.actualizar_venta);

//pago_factura
api.post('/registro_pago_factura',[auth.auth], VentaController.registro_pago_factura);
api.get('/listar_pago_factura',[auth.auth], VentaController.listar_pago_factura);
api.delete('/eliminar_pago_factura/:id',auth.auth, VentaController.eliminar_pago_factura);
api.get('/listar_pago_factura/:id',[auth.auth], VentaController.obtener_pago_factura);
api.put('/actualizar_pago_factura/:id',[auth.auth], VentaController.actualizar_pago_factura);
api.post('/registro_pago_cliente_factura/:id',[auth.auth], VentaController.registro_pago_cliente_factura);

//medio pago detalle
api.post('/registro_medio_pago_detalle',[auth.auth], VentaController.registro_medio_pago_detalle);
api.get('/listar_medio_pago_detalle',[auth.auth], VentaController.listar_medio_pago_detalle);
api.delete('/eliminar_medio_pago_detalle/:id',auth.auth, VentaController.eliminar_medio_pago_detalle);
api.get('/listar_medio_pago_detalle/:id',[auth.auth], VentaController.obtener_medio_pago_detalle);
api.put('/actualizar_medio_pago_detalle/:id',[auth.auth], VentaController.actualizar_medio_pago_detalle);
module.exports = api;