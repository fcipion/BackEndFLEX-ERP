'use strict'

var express = require('express');

var GestionController = require('../controllers/gestionController');

var api = express.Router();
var auth = require('../milddlewares/authenticate');
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir: './uploads/productos'});

//tipo_comprobante
api.post('/registro_tipo_comprobante',[auth.auth], GestionController.registro_tipo_comprobante);
api.get('/listar_tipos_comprobantes',[auth.auth], GestionController.listar_tipos_comprobantes);
api.delete('/eliminar_tipo_comprobante/:id',auth.auth, GestionController.eliminar_tipo_comprobante);
api.get('/listar_tipos_comprobantes/:id',[auth.auth], GestionController.obtener_tipo_comprobante);
api.put('/actualizar_tipo_comprobante/:id',[auth.auth], GestionController.actualizar_tipo_comprobante);

//tipo_comprobante
api.post('/registro_rango_comprobante',[auth.auth], GestionController.registro_rango_comprobante);
api.get('/listar_rango_comprobante',[auth.auth], GestionController.listar_rango_comprobante);
api.delete('/eliminar_rango_comprobante/:id',auth.auth, GestionController.eliminar_rango_comprobante);
api.get('/listar_rango_comprobante/:id',[auth.auth], GestionController.obtener_rango_comprobante);
api.put('/actualizar_rango_comprobante/:id',[auth.auth], GestionController.actualizar_rango_comprobante);

//Moneda
api.post('/registro_moneda',[auth.auth], GestionController.registro_moneda);
api.get('/listar_monedas',[auth.auth], GestionController.listar_monedas);
api.delete('/eliminar_moneda/:id',auth.auth, GestionController.eliminar_moneda);
api.get('/listar_monedas/:id',[auth.auth], GestionController.obtener_moneda);
api.put('/actualizar_moneda/:id',[auth.auth], GestionController.actualizar_moneda);

//Tasa cambio
api.post('/registro_tasa_cambio',[auth.auth], GestionController.registro_tasa_cambio);
api.get('/listar_tasa_cambio',[auth.auth], GestionController.listar_tasa_cambio);
api.delete('/eliminar_tasa_cambio/:id',auth.auth, GestionController.eliminar_tasa_cambio);
api.get('/listar_tasa_cambio/:id',[auth.auth], GestionController.obtener_tasa_cambio);
api.put('/actualizar_tasa_cambio/:id',[auth.auth], GestionController.actualizar_tasa_cambio);   

//caja
api.post('/registro_caja',[auth.auth], GestionController.registro_caja);
api.get('/listar_caja',[auth.auth], GestionController.listar_caja);
api.delete('/eliminar_caja/:id',auth.auth, GestionController.eliminar_caja);
api.get('/listar_caja/:id',[auth.auth], GestionController.obtener_caja);
api.put('/actualizar_caja/:id',[auth.auth], GestionController.actualizar_caja);   

//medio_pago
api.post('/registro_medio_pago',[auth.auth], GestionController.registro_medio_pago);
api.get('/listar_medio_pago',[auth.auth], GestionController.listar_medio_pago);
api.delete('/eliminar_medio_pago/:id',auth.auth, GestionController.eliminar_medio_pago);
api.get('/listar_medio_pago/:id',[auth.auth], GestionController.obtener_medio_pago);
api.put('/actualizar_medio_pago/:id',[auth.auth], GestionController.actualizar_medio_pago);  

//banco
api.post('/registro_banco',[auth.auth], GestionController.registro_banco);
api.get('/listar_banco',[auth.auth], GestionController.listar_banco);
api.delete('/eliminar_banco/:id',auth.auth, GestionController.eliminar_banco);
api.get('/listar_banco/:id',[auth.auth], GestionController.obtener_banco);
api.put('/actualizar_banco/:id',[auth.auth], GestionController.actualizar_banco);  

//tarjetas
api.post('/registro_tarjetas',[auth.auth], GestionController.registro_tarjetas);
api.get('/listar_tarjetas',[auth.auth], GestionController.listar_tarjetas);
api.delete('/eliminar_tarjetas/:id',auth.auth, GestionController.eliminar_tarjetas);
api.get('/listar_tarjetas/:id',[auth.auth], GestionController.obtener_tarjetas);
api.put('/actualizar_tarjetas/:id',[auth.auth], GestionController.actualizar_tarjetas);  

//turnos
api.post('/registro_turnos',[auth.auth], GestionController.registro_turnos);
api.get('/listar_turnos',[auth.auth], GestionController.listar_turnos);
api.delete('/eliminar_turnos/:id',auth.auth, GestionController.eliminar_turnos);
api.get('/listar_turnos/:id',[auth.auth], GestionController.obtener_turnos);
api.put('/actualizar_turnos/:id',[auth.auth], GestionController.actualizar_turnos);  

//proceso_caja
api.post('/registro_proceso_caja',[auth.auth], GestionController.registro_proceso_caja);
api.get('/listar_proceso_caja',[auth.auth], GestionController.listar_proceso_caja);
api.delete('/eliminar_proceso_caja/:id',auth.auth, GestionController.eliminar_proceso_caja);
api.get('/listar_proceso_caja/:id',[auth.auth], GestionController.obtener_proceso_caja);
api.put('/actualizar_proceso_caja/:id',[auth.auth], GestionController.actualizar_proceso_caja);  

//Tipo de documento
api.post('/registro_tipo_documento',[auth.auth], GestionController.registro_tipo_documento);
api.get('/listar_tipo_documento',[auth.auth], GestionController.listar_tipo_documento);
api.delete('/eliminar_tipo_documento/:id',auth.auth, GestionController.eliminar_tipo_documento);
api.get('/listar_tipo_documento/:id',[auth.auth], GestionController.obtener_tipo_documento);
api.put('/actualizar_tipo_documento/:id',[auth.auth], GestionController.actualizar_tipo_documento);

//Tipo de cliente
api.post('/registro_tipo_cliente',[auth.auth], GestionController.registro_tipo_cliente);
api.get('/listar_tipo_cliente',[auth.auth], GestionController.listar_tipo_cliente);
api.delete('/eliminar_tipo_cliente/:id',auth.auth, GestionController.eliminar_tipo_cliente);
api.get('/listar_tipo_cliente/:id',[auth.auth], GestionController.obtener_tipo_cliente);
api.put('/actualizar_tipo_cliente/:id',[auth.auth], GestionController.actualizar_tipo_cliente);

//Termino de pagos
api.post('/registro_termino_pago',[auth.auth], GestionController.registro_termino_pago);
api.get('/listar_termino_pago',[auth.auth], GestionController.listar_termino_pago);
api.delete('/eliminar_termino_pago/:id',auth.auth, GestionController.eliminar_termino_pago);
api.get('/listar_termino_pago/:id',[auth.auth], GestionController.obtener_termino_pago);
api.put('/actualizar_termino_pago/:id',[auth.auth], GestionController.actualizar_termino_pago);

//Itbis
api.post('/registro_itbis',[auth.auth], GestionController.registro_itbis);
api.get('/listar_itbis',[auth.auth], GestionController.listar_itbis);
api.delete('/eliminar_itbis/:id',auth.auth, GestionController.eliminar_itbis);
api.get('/listar_itbis/:id',[auth.auth], GestionController.obtener_itbis);
api.put('/actualizar_itbis/:id',[auth.auth], GestionController.actualizar_itbis);

//tipo_ingreso
api.post('/registro_tipo_ingreso',[auth.auth], GestionController.registro_tipo_ingreso);
api.get('/listar_tipo_ingreso',[auth.auth], GestionController.listar_tipo_ingreso);
api.delete('/eliminar_tipo_ingreso/:id',auth.auth, GestionController.eliminar_tipo_ingreso);
api.get('/listar_tipo_ingreso/:id',[auth.auth], GestionController.obtener_tipo_ingreso);
api.put('/actualizar_tipo_ingreso/:id',[auth.auth], GestionController.actualizar_tipo_ingreso);

//condiciones_pago
api.post('/registro_condiciones_pago',[auth.auth], GestionController.registro_condiciones_pago);
api.get('/listar_condiciones_pago',[auth.auth], GestionController.listar_condiciones_pago);
api.delete('/eliminar_condiciones_pago/:id',auth.auth, GestionController.eliminar_condiciones_pago);
api.get('/listar_condiciones_pago/:id',[auth.auth], GestionController.obtener_condiciones_pago);
api.put('/actualizar_condiciones_pago/:id',[auth.auth], GestionController.actualizar_condiciones_pago);

//Tipo Itbis
api.post('/registro_tipo_itbis',[auth.auth], GestionController.registro_tipo_itbis);
api.get('/listar_tipo_itbis',[auth.auth], GestionController.listar_tipo_itbis);
api.delete('/eliminar_tipo_itbis/:id',auth.auth, GestionController.eliminar_tipo_itbis);
api.get('/listar_tipo_itbis/:id',[auth.auth], GestionController.obtener_tipo_itbis);
api.put('/actualizar_tipo_itbis/:id',[auth.auth], GestionController.actualizar_tipo_itbis);
module.exports = api;