'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');

var Pagina = require('../models/pagina');
var Clase_Movimiento = require('../models/clase_movimiento');
var Movimiento_Mercancia = require('../models/movimiento_mercancia');
var Rol_Aceeso = require('../models/rol_acceso');

var Venta = require('../models/venta');
var Venta_Detalle = require('../models/venta_detalle');
var Pago_Factura = require('../models/pago_factura');
var Proceso_Medio_Pago = require('../models/proceso_medio_pago');
var Producto = require('../models/producto');

var LogController = require('../controllers/generalController');
var Config_View_Table = require('../models/config_view_table');
//Ventas
const registro_venta = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'facturas_ventas'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
                if(accesos.acceso[0].add == true){
                    var data = req.body;

                    data.compania = req.user.compania;
                    const venta = new Venta(data);
                    var movimiento_mercancia_detalleObj = [];

                    let venta_reg = await Venta.create(venta);

                    let clase_movimiento = await Clase_Movimiento.findOne({code: 'salidaVenta'});

                    //Recorrer las lineas de detalles
                    for (let i = 0; i < data.detalles.length; i++) {
                        const items = data.detalles[i];

                        items.venta = venta._id;

                        var id = items.producto;

                        var productoObj = await Producto.findById({_id:id});
                        
                        //Consultar si existen productos inventariables
                        if(productoObj.inventariable){
                            let mov_obj = {
                                almacen: items.almacen,
                                producto: items.producto,
                                cantidad: items.cantidad,
                                precio: items.precio
                            }
                            movimiento_mercancia_detalleObj.push(mov_obj);                      
                        }
                        data.detalles[i] = items;
                    };

                    //Consultar si existen movimiento de mercancias 
                    if (movimiento_mercancia_detalleObj.length > 0){
                        const mov_mercancia = new Movimiento_Mercancia({
                            compania: req.user.compania,
                            sucursal: data.sucursal, 
                            clase_movimiento: clase_movimiento._id,
                            documento: venta._id,
                            detalles: movimiento_mercancia_detalleObj
                        });
                        
                        let mov_mercancia_reg = await Movimiento_Mercancia.create(mov_mercancia);
                    }

                    //Registrar pago
                    const pago_factura = new Pago_Factura({
                        compania: req.user.compania,
                        cliente: data.cliente,
                        importe: data.total,
                        detalles: [
                            {
                                venta:venta_reg._id,
                                moneda:data.moneda,
                                importeAplicado:data.montoAplicado
                            }
                        ],
                        estatus: true
                    });
                    
                    let pago_factura_reg = await Pago_Factura.create(pago_factura);

                    //Agregar los medios de pagos
                    for (let i = 0; i < data.proceso_medio_pago.length; i++) {
                        const items = data.proceso_medio_pago[i];
                        
                        items.venta = venta._id;
                        items.compania = req.user.compania; 
                        data.proceso_medio_pago[i] = items;
                    }
                    console.log(data.proceso_medio_pago);
                    let proceso_medio_pago_reg = await Proceso_Medio_Pago.create(data.proceso_medio_pago);

                    //Agregar detalles 
                    let detalles_reg = await Venta_Detalle.create(data.detalles);

                    //log de Registro
                    LogController.log_create("facturas_ventas", data, req.user.sub, req.user.compania, venta_reg._id);

                    res.status(200).send({data:venta});
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

const listar_venta = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'facturas_ventas'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
            if(accesos.acceso[0].read == true){
                var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                let filtro = req.params['filtro'];
    
                let reg = await Venta.find({compania: req.user.compania, descripcion: new RegExp(filtro, 'i')}).populate("cliente").populate("caja").populate("doctor").populate("vendedor")
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

const eliminar_venta = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'facturas_ventas'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
            if(accesos.acceso[0].delete == true){
                var id = req.params['id'];

                let reg = await Venta.findByIdAndRemove({_id:id});

                //Log de eliminar
                LogController.log_delete("facturas_ventas", req.user.sub, req.user.compania, reg._id);

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
        res.status(400).send({message: error});
    }
}

const obtener_venta = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'facturas_ventas'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
            if(accesos.acceso[0].read == true){
                var id = req.params['id'];
                try {
                    console.log(id);
                    var reg = await Venta.findById({_id:id});

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

const actualizar_venta = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'facturas_ventas'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
            if(accesos.acceso[0].edit == true){
                let id = req.params['id'];
                var data = req.body;

                let reg = await Venta.findByIdAndUpdate({_id:id},data);

                //Log de actualizar
                LogController.log_edit("facturas_ventas", data, req.user.sub, req.user.compania, reg._id);

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

//Pago_Factura
const registro_pago_factura = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'pago_factura'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
                if(accesos.acceso[0].add == true){
                    var data = req.body;
                    
                    data.compania = req.user.compania;
                    let reg = await Pago_Factura.create(data);

                    //log de Registro
                    LogController.log_create("pago_factura", data, req.user.sub, req.user.compania, reg._id);

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

const listar_pago_factura = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'pago_factura'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
            if(accesos.acceso[0].read == true){
                let filtro = req.params['filtro'];

                let reg = await Pago_Factura.find({descripcion: new RegExp(filtro, 'i')}).populate("cliente");
                res.status(200).send({data:reg});
                
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

const eliminar_pago_factura = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'pago_factura'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
            if(accesos.acceso[0].delete == true){
                var id = req.params['id'];

                var ventas_arr = [];

                ventas_arr = await Venta.find({ doctor: id });
    
                    if (ventas_arr.length == 0) {
                        let reg = await Pago_Factura.findByIdAndRemove({_id:id});

                        //Log de eliminar
                        LogController.log_delete("pago_factura", req.user.sub, req.user.compania, reg._id);

                        res.status(200).send({data:reg});
                    }
                    else {
                        res.status(200).send({ code: 1004, message: 'No se puede eliminar este doctor, existen (' + ventas_arr.length + ') ventas con este doctor', data: undefined });
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

const obtener_pago_factura = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'pago_factura'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
            if(accesos.acceso[0].read == true){
                var id = req.params['id'];
                try {
                    var reg = await Pago_Factura.findById({_id:id}).populate("tipo_documento");

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

const actualizar_pago_factura = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'pago_factura'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
            if(accesos.acceso[0].edit == true){
                let id = req.params['id'];
                var data = req.body;

                data.descripcion = data.nombre;
                let reg = await Pago_Factura.findByIdAndUpdate({_id:id},data);

                //Log de actualizar
                LogController.log_edit("pago_factura", data, req.user.sub, req.user.compania, reg._id);
                
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
        console.log(error);
        res.status(400).send({message: error});
    }
}

const registro_pago_cliente_factura = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'pago_factura'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
                if(accesos.acceso[0].add == true){
                    let id = req.params['id'];
                    var data = req.body;
                    
                    const pagoFactura = await Pago_Factura.findById(id);

                    if(pagoFactura){
                        //Agregar el pago
                        pagoFactura.detalles.push(data);
                        var reg = await Pago_Factura.findByIdAndUpdate(id, pagoFactura);
                        
                        //log de Registro
                        LogController.log_create("pago_factura", data, req.user.sub, req.user.compania, id);

                        res.status(200).send({data:reg});
                    }
                    else{
                        res.status(500).send({message: 'No existen pagos con ese ID'});
                    }
                }
                else{
                    res.status(400).send({message: 'NoAccess'});
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

//Medio pago detalles
const registro_medio_pago_detalle = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'medio_pago_detalle' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].add == true) {
                var data = req.body;

                data.compania = req.user.compania;
                let reg = await Proceso_Medio_Pago.create(data);

                //log de Registro
                LogController.log_create("medio_pago_detalle", data, req.user.sub, req.user.compania, reg._id);

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

const listar_medio_pago_detalle = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'medio_pago_detalle' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {

                var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                let filtro = req.params['filtro'];

                let reg = await Proceso_Medio_Pago.find({ compania: req.user.compania, descripcion: new RegExp(filtro, 'i') });

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
        console.log(error);
        res.status(400).send({ message: error });
    }
}

const eliminar_medio_pago_detalle = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'medio_pago_detalle' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].delete == true) {
                var id = req.params['id'];

                var ventas_arr = [];

                ventas_arr = await Venta.find({ tipo_comprobante: id });

                if (ventas_arr.length == 0) {
                    let reg = await Proceso_Medio_Pago.findByIdAndRemove({ _id: id });
                    //Log de eliminar
                    LogController.log_delete("medio_pago_detalle", req.user.sub, req.user.compania, reg._id);

                    res.status(200).send({ data: reg });
                }
                else {
                    res.status(200).send({ code: 1004, message: 'No se puede eliminar el tipo de comprobante, existen (' + ventas_arr.length + ') ventas con este tipo de comprobante', data: undefined });
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

const obtener_medio_pago_detalle = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'medio_pago_detalle' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {
                var id = req.params['id'];
                try {
                    var reg = await Proceso_Medio_Pago.findById({ _id: id });

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

const actualizar_medio_pago_detalle = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'medio_pago_detalle' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].edit == true) {
                let id = req.params['id'];
                var data = req.body;

                data.compania = req.user.compania;
                let reg = await Proceso_Medio_Pago.findByIdAndUpdate({ _id: id }, data);

                //Log de actualizar
                LogController.log_edit("medio_pago_detalle", data, req.user.sub, req.user.compania, reg._id);

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

module.exports = {
    registro_venta,
    listar_venta,
    eliminar_venta,
    obtener_venta,
    actualizar_venta,

    registro_pago_factura,
    listar_pago_factura,
    eliminar_pago_factura,
    obtener_pago_factura,
    actualizar_pago_factura,
    registro_pago_cliente_factura,

    registro_medio_pago_detalle,
    listar_medio_pago_detalle,
    eliminar_medio_pago_detalle,
    obtener_medio_pago_detalle,
    actualizar_medio_pago_detalle,
}