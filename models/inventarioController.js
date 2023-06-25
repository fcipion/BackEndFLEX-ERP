'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');

var Pagina = require('../models/pagina');
var Rol_Aceeso = require('../models/rol_acceso');

var LogController = require('../controllers/generalController');
var Config_View_Table = require('../models/config_view_table');

var Almacen = require('../models/almacen');
var Lista_precio = require('../models/lista_precio');
var Producto = require('../models/producto');
var Determinacion_precio = require('../models/determinacion_precio');
var Clase_movimiento = require('../models/clase_movimiento');
var Movimiento_mercancia = require('../models/movimiento_mercancia');

var Tipo_producto = require('../models/tipo_producto');
var Clase_producto = require('../models/clase_producto');
var Unidad_medida = require('../models/unidad_medida');

//Almacenes
const registro_almacen = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'almacen'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
                if(accesos.acceso[0].add == true){
                    var data = req.body;
                    
                    data.compania = req.user.compania;
                    let reg = await Almacen.create(data);

                    //log de Registro
                    LogController.log_create("almacen", data, req.user.sub, req.user.compania, reg._id);

                    res.status(200).send({data:reg});
                }
                else{
                    res.status(500).send({message: 'NoAccess'});
                }
            }else{
                res.status(500).send({message: 'NoAccess'});
            }
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({message: error});
    }
}

const listar_almacen = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'almacen'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
                if(accesos.acceso[0].read == true){

                    var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                    let filtro = req.params['filtro'];

                    let reg = await Almacen.find({ compania: req.user.compania, descripcion: new RegExp(filtro, 'i') }).populate("sucursal");

                    if (reg) {
                        if (config_table) {
                            res.status(200).send({ columns: config_table.columns, rows: reg });
                        }
                        else {
                            res.status(200).send({ rows: reg });
                        }
                    }
                    else if (config_table) {
                        res.status(200).send({ columns: config_table.columns, rows: [] });
                    }
                    else {
                        res.status(200).send({ rows: [] });
                    }
                }else{
                    res.status(500).send({message: 'NoAccess'});
                }
            }else{
            res.status(500).send({message: 'NoAccess'});
        }
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({message: error});
    }
}

const eliminar_almacen = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'almacen'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
            if(accesos.acceso[0].delete == true){
                var id = req.params['id'];

                var movimiento_mercancia_arr = [];
                var producto_arr = [];

                //Movimientos de mercancia
                movimiento_mercancia_arr = await Movimiento_mercancia.find({ almacen: id });
                if (movimiento_mercancia_arr.length == 0) {

                    //Productos
                    producto_arr = await Producto.find({ almacen: id });
                    if (producto_arr.length == 0) {
                        let reg = await Almacen.findByIdAndRemove({_id:id});

                        //Log de eliminar
                        LogController.log_delete("almacen", req.user.sub, req.user.compania, reg._id);

                        res.status(200).send({data:reg});
                    }
                    else {
                        res.status(200).send({ code: 1004, message: 'No se puede eliminar el almacen, existen (' + producto_arr.length + ') productos con este almacen', data: undefined });
                    }
                }
                else {
                    res.status(200).send({ code: 1004, message: 'No se puede eliminar el almacen, existen (' + movimiento_mercancia_arr.length + ') movimientos de mercancía con este almacen', data: undefined });
                }
            }
            else{
                res.status(500).send({message: 'NoAccess'});
            }
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    } catch (error) {
        res.status(400).send({message: error});
    }
}

const obtener_almacen = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'almacen'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
            if(accesos.acceso[0].read == true){
                var id = req.params['id'];
                try {
                    var reg = await Almacen.findById({_id:id}).populate("sucursal");

                    res.status(200).send({data:reg});
                } 
                catch (error) {
                    res.status(200).send({data:undefined});
                }
            }
            else{
                res.status(500).send({message: 'NoAccess'});
            }
        }
        else{
            res.status(500).send({message: 'NoAccess'});
        }
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    } catch (error) {
        res.status(400).send({message: error});
    }
}

const actualizar_almacen = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'almacen'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
            if(accesos.acceso[0].edit == true){
                let id = req.params['id'];
                var data = req.body;

                data.compania = req.user.compania;
                let reg = await Almacen.findByIdAndUpdate({_id:id},data);

                //Log de actualizar
                LogController.log_edit("almacen", data, req.user.sub, req.user.compania, reg._id);
                
                res.status(200).send({data:data});
            }
            else{
                res.status(500).send({message: 'NoAccess'});
            }
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    } catch (error) {
        res.status(400).send({message: error});
    }
}

//Lista precio
const registro_lista_precio = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'lista_precios'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
                if(accesos.acceso[0].add == true){
                    var data = req.body;
                    data.compania = req.user.compania;
                    
                    let reg = await Lista_precio.create(data);

                    //log de Registro
                    LogController.log_create("lista_precios", data, req.user.sub, req.user.compania, reg._id);

                    res.status(200).send({data:reg});
                }
                else{
                    res.status(500).send({message: 'NoAccess'});
                }
            }else{
                res.status(500).send({message: 'NoAccess'});
            }
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({message: error});
    }
}

const listar_lista_precio = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'lista_precios'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
                if(accesos.acceso[0].read == true){

                    var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                    let filtro = req.params['filtro'];

                    let reg = await Lista_precio.find({ compania: req.user.compania, descripcion: new RegExp(filtro, 'i') }).populate("sucursal");

                    if (reg) {
                        if (config_table) {
                            res.status(200).send({ columns: config_table.columns, rows: reg });
                        }
                        else {
                            res.status(200).send({ rows: reg });
                        }
                    }
                    else if (config_table) {
                        res.status(200).send({ columns: config_table.columns, rows: [] });
                    }
                    else {
                        res.status(200).send({ rows: [] });
                    }
                    
                }else{
                    res.status(500).send({message: 'NoAccess'});
                }
            }else{
                res.status(500).send({message: 'NoAccess'});
            }
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({message: error});
    }
}

const eliminar_lista_precio = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'lista_precios'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
            if(accesos.acceso[0].delete == true){
                var id = req.params['id'];

                var determinacion_precio_arr = [];

                determinacion_precio_arr = await Determinacion_precio.find({ lista_precio: id });

                if (determinacion_precio_arr.length == 0) {
                    let reg = await Lista_precio.findByIdAndRemove({_id:id});

                    //Log de eliminar
                    LogController.log_delete("lista_precios", req.user.sub, req.user.compania, reg._id);

                    res.status(200).send({data:reg});
                }
                else {
                    res.status(200).send({ code: 1004, message: 'No se puede eliminar la lista de precio, existen (' + determinacion_precio_arr.length + ') determinaciones de precio con esta lista de precio', data: undefined });
                }
            }
            else{
                res.status(500).send({message: 'NoAccess'});
            }
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    } catch (error) {
        res.status(400).send({message: error});
    }
}

const obtener_lista_precio = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'lista_precios'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
            if(accesos.acceso[0].read == true){
                var id = req.params['id'];
                try {
                    var reg = await Lista_precio.findById({_id:id}).populate("sucursal");

                    res.status(200).send({data:reg});
                } 
                catch (error) {
                    res.status(200).send({data:undefined});
                }
            }
            else{
                res.status(500).send({message: 'NoAccess'});
            }
        }
        else{
            res.status(500).send({message: 'NoAccess'});
        }
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    } catch (error) {
        res.status(400).send({message: error});
    }
}

const actualizar_lista_precio = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'lista_precios'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
            if(accesos.acceso[0].edit == true){
                let id = req.params['id'];
                
                var data = req.body;

                data.compania = req.user.compania;

                let reg = await Lista_precio.findByIdAndUpdate({_id:id},data);
                    
                //Log de actualizar
                LogController.log_edit("lista_precios", data, req.user.sub, req.user.compania, reg._id);
                
                res.status(200).send({data:data});
            }
            else{
                res.status(500).send({message: 'NoAccess'});
            }
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    } catch (error) {
        res.status(400).send({message: error});
    }
}

//Tipo_Producto
const registro_tipo_producto = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tipo_producto' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].add == true) {
                var data = req.body;
                
                data.compania = req.user.compania;
                let reg = await Tipo_producto.create(data);

                //log de Registro
                LogController.log_create("tipo_producto", data, req.user.sub, req.user.compania, reg._id);


                res.status(200).send({ data: reg });
            }
            else {
                res.status(500).send({ message: 'NoAccess' });
            }
        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } catch (error) {
        res.status(400).send({ message: error });
    }
}

const listar_tipo_producto = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tipo_producto' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {

                var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                let filtro = req.params['filtro'];

                let reg = await Tipo_producto.find({ compania: req.user.compania, descripcion: new RegExp(filtro, 'i') });

                if (reg) {
                    if (config_table) {
                        res.status(200).send({ columns: config_table.columns, rows: reg });
                    }
                    else {
                        res.status(200).send({ rows: reg });
                    }
                }
                else if (config_table) {
                    res.status(200).send({ columns: config_table.columns, rows: [] });
                }
                else {
                    res.status(200).send({ rows: [] });
                }

            } else {
                res.status(500).send({ message: 'NoAccess' });
            }
        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } catch (error) {
        res.status(400).send({ message: error });
    }
}

const eliminar_tipo_producto = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tipo_producto' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].delete == true) {
                var id = req.params['id'];

                var productos_arr = [];

                productos_arr = await Producto.find({ tipo_producto: id });

                if (productos_arr.length == 0) {
                    let reg = await Tipo_producto.findByIdAndRemove({ _id: id });

                    //Log de eliminar
                    LogController.log_delete("tipo_producto", req.user.sub, req.user.compania, reg._id);

                    res.status(200).send({ data: reg });
                }
                else {
                    res.status(200).send({ code: 1004, message: 'No se puede eliminar el tipo de producto, existen (' + productos_arr.length + ') productos con este tipo de producto', data: undefined });
                }


            }
            else {
                res.status(500).send({ message: 'NoAccess' });
            }
        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } catch (error) {
        res.status(400).send({ message: error });
    }
}

const obtener_tipo_producto = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tipo_producto' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {
                var id = req.params['id'];
                try {
                    var reg = await Tipo_producto.findById({ _id: id });

                    res.status(200).send({ data: reg });
                }
                catch (error) {
                    res.status(200).send({ data: undefined });
                }
            }
            else {
                res.status(500).send({ message: 'NoAccess' });
            }
        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } catch (error) {
        res.status(400).send({ message: error });
    }
}

const actualizar_tipo_producto = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tipo_producto' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });

            if (accesos && accesos.acceso[0].edit == true) {
                let id = req.params['id'];
                var data = req.body;

                data.compania = req.user.compania;
                let reg = await Tipo_producto.findByIdAndUpdate({ _id: id }, data);

                //Log de actualizar
                LogController.log_edit("tipo_producto", data, req.user.sub, req.user.compania, reg._id);

                res.status(200).send({ data: data });
            }
            else {
                res.status(500).send({ message: 'NoAccess' });
            }
        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } catch (error) {
        res.status(400).send({ message: error });
    }
}

//clase_producto
const registro_clase_producto = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'clase_producto' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].add == true) {
                var data = req.body;

                data.compania = req.user.compania;
                let reg = await Clase_producto.create(data);

                //log de Registro
                LogController.log_create("clase_producto", data, req.user.sub, req.user.compania, reg._id);

                res.status(200).send({ data: reg });
            }
            else {
                res.status(500).send({ message: 'NoAccess' });
            }
        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } catch (error) {
        res.status(400).send({ message: error });
    }
}

const listar_clase_producto = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'clase_producto' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {

                var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                let filtro = req.params['filtro'];

                let reg = await Clase_producto.find({ compania: req.user.compania, descripcion: new RegExp(filtro, 'i') });

                if (reg) {
                    if (config_table) {
                        res.status(200).send({ columns: config_table.columns, rows: reg });
                    }
                    else {
                        res.status(200).send({ rows: reg });
                    }
                }
                else if (config_table) {
                    res.status(200).send({ columns: config_table.columns, rows: [] });
                }
                else {
                    res.status(200).send({ rows: [] });
                }
            } else {
                res.status(500).send({ message: 'NoAccess' });
            }
        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } catch (error) {
        res.status(400).send({ message: error });
    }
}

const eliminar_clase_producto = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'clase_producto' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].delete == true) {
                var id = req.params['id'];

                var productos_arr = [];

                productos_arr = await Producto.find({ clase_producto: id });

                if (productos_arr.length == 0) {
                    let reg = await Clase_producto.findByIdAndRemove({ _id: id });

                    //Log de eliminar
                    LogController.log_delete("clase_producto", req.user.sub, req.user.compania, reg._id);

                    res.status(200).send({ data: reg });
                }
                else {
                    res.status(200).send({ code: 1004, message: 'No se puede eliminar la clase de producto, existen (' + productos_arr.length + ') producto con esta clase de producto', data: undefined });
                }

            }
            else {
                res.status(500).send({ message: 'NoAccess' });
            }
        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } catch (error) {
        res.status(400).send({ message: error });
    }
}

const obtener_clase_producto = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'clase_producto' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {
                var id = req.params['id'];
                try {
                    var reg = await Clase_producto.findById({ _id: id });

                    res.status(200).send({ data: reg });
                }
                catch (error) {
                    res.status(200).send({ data: undefined });
                }
            }
            else {
                res.status(500).send({ message: 'NoAccess' });
            }
        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } catch (error) {
        res.status(400).send({ message: error });
    }
}

const actualizar_clase_producto = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'clase_producto' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].edit == true) {
                let id = req.params['id'];
                var data = req.body;

                data.compania = req.user.compania;
                let reg = await Clase_producto.findByIdAndUpdate({ _id: id }, data);

                //Log de actualizar
                LogController.log_edit("clase_producto", data, req.user.sub, req.user.compania, reg._id);

                res.status(200).send({ data: data });
            }
            else {
                res.status(500).send({ message: 'NoAccess' });
            }
        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } catch (error) {
        res.status(400).send({ message: error });
    }
}

//unidad_medida
const registro_unidad_medida = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'unidad_medida' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].add == true) {
                var data = req.body;

                data.compania = req.user.compania;
                let reg = await Unidad_medida.create(data);

                //log de Registro
                LogController.log_create("unidad_medida", data, req.user.sub, req.user.compania, reg._id);

                res.status(200).send({ data: reg });
            }
            else {
                res.status(500).send({ message: 'NoAccess' });
            }
        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } catch (error) {
        res.status(400).send({ message: error });
    }
}

const listar_unidad_medida = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'unidad_medida' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {

                var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                let filtro = req.params['filtro'];

                let reg = await Unidad_medida.find({ compania: req.user.compania, descripcion: new RegExp(filtro, 'i') });

                if (reg) {
                    if (config_table) {
                        res.status(200).send({ columns: config_table.columns, rows: reg });
                    }
                    else {
                        res.status(200).send({ rows: reg });
                    }
                }
                else if (config_table) {
                    res.status(200).send({ columns: config_table.columns, rows: [] });
                }
                else {
                    res.status(200).send({ rows: [] });
                }
            } else {
                res.status(500).send({ message: 'NoAccess' });
            }
        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } catch (error) {
        res.status(400).send({ message: error });
    }
}

const eliminar_unidad_medida = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'unidad_medida' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].delete == true) {
                var id = req.params['id'];

                let reg = await Unidad_medida.findByIdAndRemove({ _id: id });

                //Log de eliminar
                LogController.log_delete("unidad_medida", req.user.sub, req.user.compania, reg._id);

                res.status(200).send({ data: reg });
            }
            else {
                res.status(500).send({ message: 'NoAccess' });
            }
        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } catch (error) {
        res.status(400).send({ message: error });
    }
}

const obtener_unidad_medida = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'unidad_medida' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {
                var id = req.params['id'];
                var reg = await Unidad_medida.findById({ _id: id });

                res.status(200).send({ data: reg });
            }
            else {
                res.status(500).send({ message: 'NoAccess' });
            }
        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } catch (error) {
        res.status(400).send({ message: error });
    }
}

const actualizar_unidad_medida = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'unidad_medida' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].edit == true) {
                let id = req.params['id'];
                var data = req.body;

                data.compania = req.user.compania;
                let reg = await Unidad_medida.findByIdAndUpdate({ _id: id }, data);

                //Log de actualizar
                LogController.log_edit("unidad_medida", data, req.user.sub, req.user.compania, reg._id);

                res.status(200).send({ data: data });
            }
            else {
                res.status(500).send({ message: 'NoAccess' });
            }
        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } catch (error) {
        res.status(400).send({ message: error });
    }
}

//Productos
const registro_producto = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'Productos'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
                if(accesos.acceso[0].add == true){
                    var data = req.body;

                    data.compania = req.user.compania;
                    let reg = await Producto.create(data);

                    //log de Registro
                    LogController.log_create("Productos", data, req.user.sub, req.user.compania, reg._id);

                    res.status(200).send({data:reg});
                }
                else{
                    res.status(500).send({message: 'NoAccess'});
                }
            }
            else{
                res.status(500).send({message: 'NoAccess'});
            }
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    } catch (error) {
        res.status(400).send({message: error});
    }
}

const listar_producto = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'Productos'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
                if(accesos.acceso[0].read == true){

                    var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                    let filtro = req.params['filtro'];

                    let reg = await Producto.find({ compania: req.user.compania, descripcion: new RegExp(filtro, 'i') }).populate('sucursal').populate('almacen').populate('tipo_producto').populate('clase_producto');;

                    if (reg) {
                        if (config_table) {
                            res.status(200).send({ columns: config_table.columns, rows: reg });
                        }
                        else {
                            res.status(200).send({ rows: reg });
                        }
                    }
                    else if (config_table) {
                        res.status(200).send({ columns: config_table.columns, rows: [] });
                    }
                    else {
                        res.status(200).send({ rows: [] });
                    }
                    
                }else{
                    res.status(500).send({message: 'NoAccess'});
                }
            }
            else{
                res.status(500).send({message: 'NoAccess'});
            }
        }
        else{
            res.status(500).send({message: 'NoAccess'});
        }
    } catch (error) {
        res.status(400).send({message: error});
    }
}

const eliminar_producto = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'Productos'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
                if(accesos.acceso[0].delete == true){
                    var id = req.params['id'];

                    var movimiento_mercancia_arr = [];
                    var determinacion_precio_arr = [];

                    //Movimientos de mercancia
                    movimiento_mercancia_arr = await Movimiento_mercancia.find({ producto: id });
                    if (movimiento_mercancia_arr.length == 0) {

                        //Productos
                        determinacion_precio_arr = await Determinacion_precio.find({ producto: id });
                        if (determinacion_precio_arr.length == 0) {
                            let reg = await Producto.findByIdAndRemove({_id:id});

                            //Log de eliminar
                            LogController.log_delete("Productos", req.user.sub, req.user.compania, reg._id);

                            res.status(200).send({data:reg});
                        }
                        else {
                            res.status(200).send({ code: 1004, message: 'No se puede eliminar el producto, existen (' + determinacion_precio_arr.length + ') determinaciones de precios con este producto', data: undefined });
                        }
                    }
                    else {
                        res.status(200).send({ code: 1004, message: 'No se puede eliminar el producto, existen (' + movimiento_mercancia_arr.length + ') movimientos de mercancía con este producto', data: undefined });
                    }
                }
                else{
                    res.status(500).send({message: 'NoAccess'});
                }
            }
            else
            {
                res.status(500).send({message: 'NoAccess'});
            }
        }
        else{
            res.status(500).send({message: 'NoAccess'});
        }
    } 
    catch (error) {
        res.status(400).send({message: error});
    }
}

const obtener_producto = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'Productos'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
                if(accesos.acceso[0].read == true){
                    var id = req.params['id'];
                    try {
                        var reg = await Producto.findById({_id:id}).populate('sucursal').populate('almacen').populate('tipo_producto').populate('clase_producto');

                        res.status(200).send({data:reg});
                    } 
                    catch (error) {
                        res.status(200).send({data:undefined});
                    }
                }
                else{
                    res.status(500).send({message: 'NoAccess'});
                }
            }
            else{
                res.status(500).send({message: 'NoAccess'});
            }
        }
        else{
            res.status(500).send({message: 'NoAccess'});
        }
    } 
    catch (error) {
        res.status(400).send({message: error});
    }
}

const actualizar_producto = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'Productos'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
                if(accesos.acceso[0].edit == true){
                    let id = req.params['id'];
                    var data = req.body;

                    data.compania = req.user.compania;
                    let reg = await Producto.findByIdAndUpdate({_id:id},data);
                        
                    //Log de actualizar
                    LogController.log_edit("Productos", data, req.user.sub, req.user.compania, reg._id);
                        
                    res.status(200).send({data:data});
                }
                else{
                    res.status(500).send({message: 'NoAccess'});
                }
            }
            else
            {
                res.status(500).send({message: 'NoAccess'});
            }
        }
        else
        {
            res.status(500).send({message: 'NoAccess'});
        }
    } 
    catch (error) {
        res.status(400).send({message: error});
    }
}

//Determinacion de precio
const registro_determinacion_precio = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'determinacion_precios'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
                if(accesos.acceso[0].add == true){
                    var data = req.body;
                    
                    data.compania = req.user.compania;
                    let reg = await Determinacion_precio.create(data);

                    //log de Registro
                    LogController.log_create("determinacion_precios", data, req.user.sub, req.user.compania, reg._id);

                    res.status(200).send({data:reg});
                }
                else{
                    res.status(500).send({message: 'NoAccess'});
                }
            }
            else{
                res.status(500).send({message: 'NoAccess'});
            }
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    } catch (error) {
        res.status(400).send({message: error});
    }
}

const listar_determinacion_precio = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'determinacion_precios'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
                if(accesos.acceso[0].read == true){

                    var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                    let filtro = req.params['filtro'];

                    let reg = await Determinacion_precio.find({ compania: req.user.compania, descripcion: new RegExp(filtro, 'i') }).populate('detalles').populate('sucursal').populate('producto').populate('lista_precio');

                    if (reg) {
                        if (config_table) {
                            res.status(200).send({ columns: config_table.columns, rows: reg });
                        }
                        else {
                            res.status(200).send({ rows: reg });
                        }
                    }
                    else if (config_table) {
                        res.status(200).send({ columns: config_table.columns, rows: [] });
                    }
                    else {
                        res.status(200).send({ rows: [] });
                    }
                    
                }else{
                    res.status(500).send({message: 'NoAccess'});
                }
            }
            else{
                res.status(500).send({message: 'NoAccess'});
            }
        }
        else{
            res.status(500).send({message: 'NoAccess'});
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({message: error});
    }
}

const eliminar_determinacion_precio = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'determinacion_precios'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
                if(accesos.acceso[0].delete == true){
                    var id = req.params['id'];

                    let reg = await Determinacion_precio.findByIdAndRemove({_id:id});

                    //Log de eliminar
                    LogController.log_delete("determinacion_precios", req.user.sub, req.user.compania, reg._id);

                    res.status(200).send({data:reg});
                }
                else{
                    res.status(500).send({message: 'NoAccess'});
                }
            }
            else
            {
                res.status(500).send({message: 'NoAccess'});
            }
        }
        else{
            res.status(500).send({message: 'NoAccess'});
        }
    } 
    catch (error) {
        res.status(400).send({message: error});
    }
}

const obtener_determinacion_precio = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'determinacion_precios'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
                if(accesos.acceso[0].read == true){
                    var id = req.params['id'];
                    try {
                        var reg = await Determinacion_precio.findById({_id:id}).populate('sucursal').populate('producto').populate('lista_precio');

                        res.status(200).send({data:reg});
                    } 
                    catch (error) {
                        res.status(200).send({data:undefined});
                    }
                }
                else{
                    res.status(500).send({message: 'NoAccess'});
                }
            }
            else{
                res.status(500).send({message: 'NoAccess'});
            }
        }
        else{
            res.status(500).send({message: 'NoAccess'});
        }
    } 
    catch (error) {
        res.status(400).send({message: error});
    }
}

const actualizar_determinacion_precio = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'determinacion_precios'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
                if(accesos.acceso[0].edit == true){
                    let id = req.params['id'];
                    var data = req.body;

                    data.compania = req.user.compania;
                    let reg = await Determinacion_precio.findByIdAndUpdate({_id:id},data);

                    //Log de actualizar
                    LogController.log_edit("determinacion_precios", data, req.user.sub, req.user.compania, reg._id);

                    res.status(200).send({data:data});
                }
                else{
                    res.status(500).send({message: 'NoAccess'});
                }
            }
            else
            {
                res.status(500).send({message: 'NoAccess'});
            }
        }
        else
        {
            res.status(500).send({message: 'NoAccess'});
        }
    } 
    catch (error) {
        res.status(400).send({message: error});
    }
}

//Clase de movimiento
const registro_clase_movimiento = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'clase_movimiento'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
                if(accesos.acceso[0].add == true){
                    var data = req.body;
                    
                    data.compania = req.user.compania;
                    let reg = await Clase_movimiento.create(data);

                    //log de Registro
                    LogController.log_create("clase_movimiento", data, req.user.sub, req.user.compania, reg._id);

                    res.status(200).send({data:reg});
                }
                else{
                    res.status(500).send({message: 'NoAccess'});
                }
            }
            else{
                res.status(500).send({message: 'NoAccess'});
            }
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    } catch (error) {
        res.status(400).send({message: error});
    }
}

const listar_clase_movimiento = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'clase_movimiento'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
                if(accesos.acceso[0].read == true){

                    var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                    let filtro = req.params['filtro'];

                    let reg = await Clase_movimiento.find({ compania: req.user.compania, descripcion: new RegExp(filtro, 'i') });

                    if (reg) {
                        if (config_table) {
                            res.status(200).send({ columns: config_table.columns, rows: reg });
                        }
                        else {
                            res.status(200).send({ rows: reg });
                        }
                    }
                    else if (config_table) {
                        res.status(200).send({ columns: config_table.columns, rows: [] });
                    }
                    else {
                        res.status(200).send({ rows: [] });
                    }
                    
                }else{
                    res.status(500).send({message: 'NoAccess'});
                }
            }
            else{
                res.status(500).send({message: 'NoAccess'});
            }
        }
        else{
            res.status(500).send({message: 'NoAccess'});
        }
    } catch (error) {
        res.status(400).send({message: error});
    }
}

const eliminar_clase_movimiento = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'clase_movimiento'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
                if(accesos.acceso[0].delete == true){
                    var id = req.params['id'];

                    var movimiento_mercancia_arr = [];

                    movimiento_mercancia_arr = await Movimiento_mercancia.find({ clase_movimiento: id });
    
                    if (movimiento_mercancia_arr.length == 0) {
                        let reg = await Clase_movimiento.findByIdAndRemove({_id:id});

                        //Log de eliminar
                        LogController.log_delete("clase_movimiento", req.user.sub, req.user.compania, reg._id);

                        res.status(200).send({data:reg});
                    }
                    else {
                        res.status(200).send({ code: 1004, message: 'No se puede eliminar la clase de movimiento, existen (' + movimiento_mercancia_arr.length + ') movimientos de mercancias con esta clase de movimiento', data: undefined });
                    }
                }
                else{
                    res.status(500).send({message: 'NoAccess'});
                }
            }
            else
            {
                res.status(500).send({message: 'NoAccess'});
            }
        }
        else{
            res.status(500).send({message: 'NoAccess'});
        }
    } 
    catch (error) {
        res.status(400).send({message: error});
    }
}

const obtener_clase_movimiento = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'clase_movimiento'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
                if(accesos.acceso[0].read == true){
                    var id = req.params['id'];
                    try {
                        var reg = await Clase_movimiento.findById({_id:id});

                        res.status(200).send({data:reg});
                    } 
                    catch (error) {
                        res.status(200).send({data:undefined});
                    }
                }
                else{
                    res.status(500).send({message: 'NoAccess'});
                }
            }
            else{
                res.status(500).send({message: 'NoAccess'});
            }
        }
        else{
            res.status(500).send({message: 'NoAccess'});
        }
    } 
    catch (error) {
        res.status(400).send({message: error});
    }
}

const actualizar_clase_movimiento = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'clase_movimiento'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
                if(accesos.acceso[0].edit == true){
                    let id = req.params['id'];
                    var data = req.body;

                    data.compania = req.user.compania;
                    let reg = await Clase_movimiento.findByIdAndUpdate({_id:id},data);

                    //Log de actualizar
                    LogController.log_edit("clase_movimiento", data, req.user.sub, req.user.compania, reg._id);
                        
                    res.status(200).send({data:data});
                }
                else{
                    res.status(500).send({message: 'NoAccess'});
                }
            }
            else
            {
                res.status(500).send({message: 'NoAccess'});
            }
        }
        else
        {
            res.status(500).send({message: 'NoAccess'});
        }
    } 
    catch (error) {
        res.status(400).send({message: error});
    }
}

//Clase de movimiento
const registro_movimiento_mercancia = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'movimiento_mercancia'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
                if(accesos.acceso[0].add == true){
                    var data = req.body;
                    
                    data.compania = req.user.compania;
                    let reg = await Movimiento_mercancia.create(data);

                    //log de Registro
                    LogController.log_create("movimiento_mercancia", data, req.user.sub, req.user.compania, reg._id);

                    res.status(200).send({data:reg});
                }
                else{
                    res.status(500).send({message: 'NoAccess'});
                }
            }
            else{
                res.status(500).send({message: 'NoAccess'});
            }
        }else{
            res.status(500).send({message: 'NoAccess'});
        }
    } catch (error) {
        res.status(400).send({message: error});
    }
}

const listar_movimiento_mercancia = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'movimiento_mercancia'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
                if(accesos.acceso[0].read == true){

                    var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                    let filtro = req.params['filtro'];

                    let reg = await Movimiento_mercancia.find({ compania: req.user.compania, descripcion: new RegExp(filtro, 'i') });

                    if (reg) {
                        if (config_table) {
                            res.status(200).send({ columns: config_table.columns, rows: reg });
                        }
                        else {
                            res.status(200).send({ rows: reg });
                        }
                    }
                    else if (config_table) {
                        res.status(200).send({ columns: config_table.columns, rows: [] });
                    }
                    else {
                        res.status(200).send({ rows: [] });
                    }
                }else{
                    res.status(500).send({message: 'NoAccess'});
                }
            }
            else{
                res.status(500).send({message: 'NoAccess'});
            }
        }
        else{
            res.status(500).send({message: 'NoAccess'});
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({message: error});
    }
}

const eliminar_movimiento_mercancia = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'movimiento_mercancia'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
                if(accesos.acceso[0].delete == true){
                    var id = req.params['id'];

                    let reg = await Movimiento_mercancia.findByIdAndRemove({_id:id});

                    //Log de eliminar
                    LogController.log_delete("movimiento_mercancia", req.user.sub, req.user.compania, reg._id);

                    res.status(200).send({data:reg});
                }
                else{
                    res.status(500).send({message: 'NoAccess'});
                }
            }
            else
            {
                res.status(500).send({message: 'NoAccess'});
            }
        }
        else{
            res.status(500).send({message: 'NoAccess'});
        }
    } 
    catch (error) {
        res.status(400).send({message: error});
    }
}

const obtener_movimiento_mercancia = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'movimiento_mercancia'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
                if(accesos.acceso[0].read == true){
                    var id = req.params['id'];
                    try {
                        var reg = await Movimiento_mercancia.findById({_id:id});

                        res.status(200).send({data:reg});
                    } 
                    catch (error) {
                        res.status(200).send({data:undefined});
                    }
                }
                else{
                    res.status(500).send({message: 'NoAccess'});
                }
            }
            else{
                res.status(500).send({message: 'NoAccess'});
            }
        }
        else{
            res.status(500).send({message: 'NoAccess'});
        }
    } 
    catch (error) {
        res.status(400).send({message: error});
    }
}

const actualizar_movimiento_mercancia = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'movimiento_mercancia'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
                if(accesos.acceso[0].edit == true){
                    let id = req.params['id'];
                    var data = req.body;

                    data.compania = req.user.compania;
                    let reg = await Movimiento_mercancia.findByIdAndUpdate({_id:id},data);

                    //Log de actualizar
                    LogController.log_edit("movimiento_mercancia", data, req.user.sub, req.user.compania, reg._id);

                    res.status(200).send({data:data});
                }
                else{
                    res.status(500).send({message: 'NoAccess'});
                }
            }
            else
            {
                res.status(500).send({message: 'NoAccess'});
            }
        }
        else
        {
            res.status(500).send({message: 'NoAccess'});
        }
    } 
    catch (error) {
        res.status(400).send({message: error});
    }
}

module.exports = {
    registro_almacen,
    listar_almacen,
    eliminar_almacen,
    obtener_almacen,
    actualizar_almacen,

    registro_lista_precio,
    listar_lista_precio,
    eliminar_lista_precio,
    obtener_lista_precio,
    actualizar_lista_precio,

    registro_producto,
    listar_producto,
    eliminar_producto,
    obtener_producto,
    actualizar_producto,

    registro_determinacion_precio,
    listar_determinacion_precio,
    eliminar_determinacion_precio,
    obtener_determinacion_precio,
    actualizar_determinacion_precio,

    registro_clase_movimiento,
    listar_clase_movimiento,
    eliminar_clase_movimiento,
    obtener_clase_movimiento,
    actualizar_clase_movimiento,

    registro_movimiento_mercancia,
    listar_movimiento_mercancia,
    eliminar_movimiento_mercancia,
    obtener_movimiento_mercancia,
    actualizar_movimiento_mercancia,

    registro_tipo_producto,
    listar_tipo_producto,
    eliminar_tipo_producto,
    obtener_tipo_producto,
    actualizar_tipo_producto,

    registro_clase_producto,
    listar_clase_producto,
    eliminar_clase_producto,
    obtener_clase_producto,
    actualizar_clase_producto,

    registro_unidad_medida,
    listar_unidad_medida,
    eliminar_unidad_medida,
    obtener_unidad_medida,
    actualizar_unidad_medida,
}