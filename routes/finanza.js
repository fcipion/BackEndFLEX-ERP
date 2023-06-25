'use strict'

var express = require('express');

var FinanzaController = require('../controllers/finanzaController');

var api = express.Router();
var auth = require('../milddlewares/authenticate');
var multiparty = require('connect-multiparty');
var path = multiparty({uploadDir: './uploads/representante_comercial'});

//Cuenta contables
api.post('/registro_cuenta_contable',[auth.auth], FinanzaController.registro_cuenta_contable);
api.get('/listar_cuenta_contable',[auth.auth], FinanzaController.listar_cuenta_contable);
api.delete('/eliminar_cuenta_contable/:id',auth.auth, FinanzaController.eliminar_cuenta_contable);
api.get('/listar_cuenta_contable/:id',[auth.auth], FinanzaController.obtener_cuenta_contable);
api.put('/actualizar_cuenta_contable/:id',[auth.auth], FinanzaController.actualizar_cuenta_contable);
    
module.exports = api;