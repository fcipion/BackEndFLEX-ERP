'use strict'

var express = require('express');

var AdministracionController = require('../controllers/administracionController');


var api = express.Router();
var auth = require('../milddlewares/authenticate');
var multiparty = require('connect-multiparty');
var path_company = multiparty({uploadDir: './uploads/companias'});

//Companias 
api.post('/registro_compania',[auth.auth, path_company], AdministracionController.registro_compania);
api.get('/listar_compania',[auth.auth], AdministracionController.listar_compania);
api.delete('/eliminar_compania/:id',auth.auth, AdministracionController.eliminar_compania);
api.get('/listar_compania/:id',[auth.auth], AdministracionController.obtener_compania);
api.put('/actualizar_compania/:id',[auth.auth, path_company], AdministracionController.actualizar_compania);
api.get('/obtener_compania_img/:img', AdministracionController.obtener_compania_img);

//Sucursales
api.post('/registro_sucursal',[auth.auth], AdministracionController.registro_sucursal);
api.get('/listar_sucursales',[auth.auth], AdministracionController.listar_sucursales);
api.delete('/eliminar_sucursal/:id',auth.auth, AdministracionController.eliminar_sucursal);
api.get('/listar_sucursales/:id',[auth.auth], AdministracionController.obtener_sucursal);
api.put('/actualizar_sucursal/:id',[auth.auth], AdministracionController.actualizar_sucursal);

//Modulos
api.post('/registro_modulo',[auth.auth], AdministracionController.registro_modulo);
api.get('/listar_modulo',[auth.auth], AdministracionController.listar_modulo);
api.delete('/eliminar_modulo/:id',auth.auth, AdministracionController.eliminar_modulo);
api.get('/listar_modulo/:id',[auth.auth], AdministracionController.obtener_modulo);
api.put('/actualizar_modulo/:id',[auth.auth], AdministracionController.actualizar_modulo);

//Paginas
api.post('/registro_pagina',[auth.auth], AdministracionController.registro_pagina);
api.get('/listar_pagina',[auth.auth], AdministracionController.listar_pagina);
api.delete('/eliminar_pagina/:id',auth.auth, AdministracionController.eliminar_pagina);
api.get('/listar_pagina/:id',[auth.auth], AdministracionController.obtener_pagina);
api.put('/actualizar_pagina/:id',[auth.auth], AdministracionController.actualizar_pagina);

//Roles
api.post('/registro_rol',[auth.auth], AdministracionController.registro_rol);
api.get('/listar_roles',[auth.auth], AdministracionController.listar_roles);
api.delete('/eliminar_rol/:id',auth.auth, AdministracionController.eliminar_rol);
api.get('/listar_roles/:id',[auth.auth], AdministracionController.obtener_rol);
api.put('/actualizar_rol/:id',[auth.auth], AdministracionController.actualizar_rol);

//rol_acceso
api.post('/registro_rol_acceso',[auth.auth], AdministracionController.registro_rol_acceso);
api.get('/listar_roles_acceso',[auth.auth], AdministracionController.listar_roles_acceso);
api.delete('/eliminar_rol_acceso/:id',auth.auth, AdministracionController.eliminar_rol_acceso);
api.get('/listar_roles_acceso/:id',[auth.auth], AdministracionController.obtener_rol_acceso);
api.put('/actualizar_rol_acceso/:id',[auth.auth], AdministracionController.actualizar_rol_acceso);

//Idiomas
api.post('/registro_idioma',[auth.auth], AdministracionController.registro_idioma);
api.get('/listar_idioma',[auth.auth], AdministracionController.listar_idioma);
api.delete('/eliminar_idioma/:id',auth.auth, AdministracionController.eliminar_idioma);
api.get('/listar_idioma/:id',[auth.auth], AdministracionController.obtener_idioma);
api.put('/actualizar_idioma/:id',[auth.auth], AdministracionController.actualizar_idioma);

//Usuario 
api.post('/registro_usuario',[auth.auth], AdministracionController.registro_usuario);
api.get('/listar_usuario',[auth.auth], AdministracionController.listar_usuario);
api.delete('/eliminar_usuario/:id',auth.auth, AdministracionController.eliminar_usuario);
api.get('/listar_usuario/:id',[auth.auth], AdministracionController.obtener_usuario);
api.put('/actualizar_usuario/:id',[auth.auth], AdministracionController.actualizar_usuario);

//Usuario 
api.post('/registro_estado',[auth.auth], AdministracionController.registro_estado);
api.get('/listar_estados',[auth.auth], AdministracionController.listar_estados);
api.delete('/eliminar_estado/:id',auth.auth, AdministracionController.eliminar_estado);
api.get('/obtener_estado/:id',[auth.auth], AdministracionController.obtener_estado);
api.put('/actualizar_estado/:id',[auth.auth], AdministracionController.actualizar_estado);

//Login
api.post('/login_admin', AdministracionController.login_admin);

module.exports = api;