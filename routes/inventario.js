'use strict'

var express = require('express');

var InventarioController = require('../controllers/inventarioController');

var api = express.Router();
var auth = require('../milddlewares/authenticate');
var multiparty = require('connect-multiparty');
//var path = multiparty({uploadDir: './uploads/representante_comercial'});

//Almacenes
api.post('/registro_almacen',[auth.auth], InventarioController.registro_almacen);
api.get('/listar_almacen',[auth.auth], InventarioController.listar_almacen);
api.delete('/eliminar_almacen/:id',auth.auth, InventarioController.eliminar_almacen);
api.get('/listar_almacen/:id',[auth.auth], InventarioController.obtener_almacen);
api.put('/actualizar_almacen/:id',[auth.auth], InventarioController.actualizar_almacen);

//Lista de precio
api.post('/registro_lista_precio',[auth.auth], InventarioController.registro_lista_precio);
api.get('/listar_lista_precio',[auth.auth], InventarioController.listar_lista_precio);
api.delete('/eliminar_lista_precio/:id',auth.auth, InventarioController.eliminar_lista_precio);
api.get('/listar_lista_precio/:id',[auth.auth], InventarioController.obtener_lista_precio);
api.put('/actualizar_lista_precio/:id',[auth.auth], InventarioController.actualizar_lista_precio);

//Productos
api.post('/registro_producto',[auth.auth], InventarioController.registro_producto);
api.get('/listar_producto',[auth.auth], InventarioController.listar_producto);
api.delete('/eliminar_producto/:id',auth.auth, InventarioController.eliminar_producto);
api.get('/listar_producto/:id',[auth.auth], InventarioController.obtener_producto);
api.put('/actualizar_producto/:id',[auth.auth], InventarioController.actualizar_producto);

//Determinacion Precio
api.post('/registro_determinacion_precio',[auth.auth], InventarioController.registro_determinacion_precio);
api.get('/listar_determinacion_precio',[auth.auth], InventarioController.listar_determinacion_precio);
api.delete('/eliminar_determinacion_precio/:id',auth.auth, InventarioController.eliminar_determinacion_precio);
api.get('/listar_determinacion_precio/:id',[auth.auth], InventarioController.obtener_determinacion_precio);
api.put('/actualizar_determinacion_precio/:id',[auth.auth], InventarioController.actualizar_determinacion_precio);

//Clase de movimientos
api.post('/registro_clase_movimiento',[auth.auth], InventarioController.registro_clase_movimiento);
api.get('/listar_clase_movimiento',[auth.auth], InventarioController.listar_clase_movimiento);
api.delete('/eliminar_clase_movimiento/:id',auth.auth, InventarioController.eliminar_clase_movimiento);
api.get('/listar_clase_movimiento/:id',[auth.auth], InventarioController.obtener_clase_movimiento);
api.put('/actualizar_clase_movimiento/:id',[auth.auth], InventarioController.actualizar_clase_movimiento);

//Movimiento de mercancia
api.post('/registro_movimiento_mercancia',[auth.auth], InventarioController.registro_movimiento_mercancia);
api.get('/listar_movimiento_mercancia',[auth.auth], InventarioController.listar_movimiento_mercancia);
api.delete('/eliminar_movimiento_mercancia/:id',auth.auth, InventarioController.eliminar_movimiento_mercancia);
api.get('/listar_movimiento_mercancia/:id',[auth.auth], InventarioController.obtener_movimiento_mercancia);
api.put('/actualizar_movimiento_mercancia/:id',[auth.auth], InventarioController.actualizar_movimiento_mercancia);

//Tipo producto
api.post('/registro_tipo_producto',[auth.auth], InventarioController.registro_tipo_producto);
api.get('/listar_tipo_producto',[auth.auth], InventarioController.listar_tipo_producto);
api.delete('/eliminar_tipo_producto/:id',auth.auth, InventarioController.eliminar_tipo_producto);
api.get('/listar_tipo_producto/:id',[auth.auth], InventarioController.obtener_tipo_producto);
api.put('/actualizar_tipo_producto/:id',[auth.auth], InventarioController.actualizar_tipo_producto);

//clase_producto
api.post('/registro_clase_producto',[auth.auth], InventarioController.registro_clase_producto);
api.get('/listar_clase_producto',[auth.auth], InventarioController.listar_clase_producto);
api.delete('/eliminar_clase_producto/:id',auth.auth, InventarioController.eliminar_clase_producto);
api.get('/listar_clase_producto/:id',[auth.auth], InventarioController.obtener_clase_producto);
api.put('/actualizar_clase_producto/:id',[auth.auth], InventarioController.actualizar_clase_producto);    

//unidad_medida
api.post('/registro_unidad_medida',[auth.auth], InventarioController.registro_unidad_medida);
api.get('/listar_unidad_medida',[auth.auth], InventarioController.listar_unidad_medida);
api.delete('/eliminar_unidad_medida/:id',auth.auth, InventarioController.eliminar_unidad_medida);
api.get('/listar_unidad_medida/:id',[auth.auth], InventarioController.obtener_unidad_medida);
api.put('/actualizar_unidad_medida/:id',[auth.auth], InventarioController.actualizar_unidad_medida); 
module.exports = api;