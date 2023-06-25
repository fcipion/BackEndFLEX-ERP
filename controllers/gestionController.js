'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');

var Pagina = require('../models/pagina');
var Rol_Aceeso = require('../models/rol_acceso');
var Log = require('../models/log');
var Log_Item = require('../models/log_item');

var LogController = require('../controllers/generalController');
var Config_View_Table = require('../models/config_view_table');

var Tipos_comprobantes = require('../models/tipos_comprobante');
var Rango_comprobante = require('../models/rango_comprobante');
var Monedas = require('../models/monedas');
var Tasa_cambio = require('../models/tasa_cambio');
var Caja = require('../models/caja');
var Medio_pago = require('../models/medio_pago');
var Banco = require('../models/banco');
var Tarjeta = require('../models/tarjeta');
var Turno = require('../models/turno');
var Proceso_caja = require('../models/proceso_caja');
var Tipo_documento = require('../models/tipo_documento');
var Tipo_cliente = require('../models/tipo_cliente');
var Tipo_itbis = require('../models/tipos_itbis');
var Termino_pago = require('../models/termino_pago');
var Itbis = require('../models/itbis');
var Tipo_ingreso = require('../models/tipo_ingreso');
var Condiciones_Pago = require('../models/condiciones_pago');

var Venta = require('../models/venta');
var Venta_Detalle = require('../models/venta_detalle');
var Cliente = require('../models/cliente');
var Companias = require('../models/compania');
var Determinacion_precio = require('../models/determinacion_precio');
var Proveedor = require('../models/proveedor');
var Producto = require('../models/producto');
var Doctor = require('../models/doctor');

//tipos_comprobante
const registro_tipo_comprobante = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tipos_comprobantes' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].add == true) {
                var data = req.body;

                data.compania = req.user.compania;
                let reg = await Tipos_comprobantes.create(data);

                //log de Registro
                LogController.log_create("tipos_comprobantes", data, req.user.sub, req.user.compania, reg._id);

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

const listar_tipos_comprobantes = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tipos_comprobantes' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {

                var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                let filtro = req.params['filtro'];

                let reg = await Tipos_comprobantes.find({ compania: req.user.compania, descripcion: new RegExp(filtro, 'i') });

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

const eliminar_tipo_comprobante = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tipos_comprobantes' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].delete == true) {
                var id = req.params['id'];

                var ventas_arr = [];

                ventas_arr = await Venta.find({ tipo_comprobante: id });

                if (ventas_arr.length == 0) {
                    let reg = await Tipos_comprobantes.findByIdAndRemove({ _id: id });
                    //Log de eliminar
                    LogController.log_delete("tipos_comprobantes", req.user.sub, req.user.compania, reg._id);

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

const obtener_tipo_comprobante = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tipos_comprobantes' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {
                var id = req.params['id'];
                try {
                    var reg = await Tipos_comprobantes.findById({ _id: id });

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

const actualizar_tipo_comprobante = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tipos_comprobantes' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].edit == true) {
                let id = req.params['id'];
                var data = req.body;

                data.compania = req.user.compania;
                let reg = await Tipos_comprobantes.findByIdAndUpdate({ _id: id }, data);

                //Log de actualizar
                LogController.log_edit("tipos_comprobantes", data, req.user.sub, req.user.compania, reg._id);

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

//rango_comprobante
const registro_rango_comprobante = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'rangos_comprobantes' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].add == true) {
                var data = req.body;

                data.compania = req.user.compania;
                let reg = await Rango_comprobante.create(data);

                //log de Registro
                LogController.log_create("rangos_comprobantes", data, req.user.sub, req.user.compania, reg._id);

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

const listar_rango_comprobante = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'rangos_comprobantes' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {

                var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                let filtro = req.params['filtro'];

                let reg = await Rango_comprobante.find({ compania: req.user.compania, descripcion: new RegExp(filtro, 'i') }).populate('tipos_comprobante');

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

const eliminar_rango_comprobante = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'rangos_comprobantes' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].delete == true) {
                var id = req.params['id'];

                let reg = await Rango_comprobante.findByIdAndRemove({ _id: id });

                //Log de eliminar
                LogController.log_delete("rangos_comprobantes", req.user.sub, req.user.compania, reg._id);

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

const obtener_rango_comprobante = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'rangos_comprobantes' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {
                var id = req.params['id'];
                try {
                    var reg = await Rango_comprobante.findById({ _id: id });

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

const actualizar_rango_comprobante = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'rangos_comprobantes' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].edit == true) {
                let id = req.params['id'];
                var data = req.body;

                data.compania = req.user.compania;
                let reg = await Rango_comprobante.findByIdAndUpdate({ _id: id }, data);

                //Log de actualizar
                LogController.log_edit("rangos_comprobantes", data, req.user.sub, req.user.compania, reg._id);

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

//Monedas
const registro_moneda = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'monedas' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].add == true) {

                var data = req.body;
                data.compania = req.user.compania;
                let reg = await Monedas.create(data);

                //Log
                LogController.log_create("monedas", data, req.user.sub, req.user.compania, reg._id);

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

const listar_monedas = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'monedas' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {

                var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                let filtro = req.params['filtro'];

                let reg = await Monedas.find({ compania: req.user.compania, descripcion: new RegExp(filtro, 'i') });

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

const eliminar_moneda = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'monedas' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].delete == true) {
                var id = req.params['id'];

                var ventas_arr = [];
                var clientes_arr = [];
                var companias_arr = [];
                var determinacion_precio_arr = [];
                var proveedor_arr = [];
                var tasa_cambio_arr = [];
                //validar si existen ventas
                ventas_arr = await Venta.find({ moneda: id });
                if (ventas_arr.length == 0) {

                    //validar si existen clientes
                    clientes_arr = await Cliente.find({ moneda_curso: id });
                    if (clientes_arr.length == 0) {

                        //validar si existen companias
                        companias_arr = await Companias.find({ $or: [{ moneda_curso: id }, { moneda_paralela: id }] });
                        if (companias_arr.length == 0) {

                            //validar si existen Determinacion_precio
                            determinacion_precio_arr = await Determinacion_precio.find({ moneda: id });
                            if (determinacion_precio_arr.length == 0) {

                                //validar si existen proveedores
                                proveedor_arr = await Proveedor.find({ moneda_curso: id });
                                if (proveedor_arr.length == 0) {

                                    let reg = await Monedas.findByIdAndRemove({ _id: id });
                                    //Log de eliminar
                                    LogController.log_delete("monedas", req.user.sub, req.user.compania, reg._id);

                                    res.status(200).send({ data: reg });
                                }
                                else {
                                    res.status(200).send({ code: 1004, message: 'No se puede eliminar la moneda, existen (' + proveedor_arr.length + ') proveedores con esta moneda', data: undefined });
                                }
                            }
                            else {
                                res.status(200).send({ code: 1004, message: 'No se puede eliminar la moneda, existen (' + determinacion_precio_arr.length + ') determinaciones de precio ccon esta moneda', data: undefined });
                            }
                        }
                        else {
                            res.status(200).send({ code: 1004, message: 'No se puede eliminar la moneda, existen (' + companias_arr.length + ') compañía con esta moneda', data: undefined });
                        }
                    }
                    else {
                        res.status(200).send({ code: 1004, message: 'No se puede eliminar la moneda, existen (' + clientes_arr.length + ') clientes con esta moneda', data: undefined });
                    }
                }
                else {
                    res.status(200).send({ code: 1004, message: 'No se puede eliminar la moneda, existen (' + ventas_arr.length + ') ventas con esta moneda', data: undefined });
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

const obtener_moneda = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'monedas' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {
                var id = req.params['id'];
                try {
                    var reg = await Monedas.findById({ _id: id });

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

const actualizar_moneda = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'monedas' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].edit == true) {
                let id = req.params['id'];
                var data = req.body;

                data.compania = req.user.compania;
                let reg = await Monedas.findByIdAndUpdate({ _id: id }, data);

                console.log(id);

                //Log
                LogController.log_edit("monedas", data, req.user.sub, req.user.compania, reg._id);

                res.status(200).send({ data: data });
            }
            else {
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

//tasa_cambio
const registro_tasa_cambio = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tasa_cambio' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].add == true) {

                var data = req.body;
                data.compania = req.user.compania;
                let reg = await Tasa_cambio.create(data);

                //log de Registro
                LogController.log_create("tasa_cambio", data, req.user.sub, req.user.compania, reg._id);

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

const listar_tasa_cambio = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tasa_cambio' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {

                var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                let filtro = req.params['filtro'];

                let reg = await Tasa_cambio.find({ compania: req.user.compania, descripcion: new RegExp(filtro, 'i') }).populate('moneda_from').populate('moneda_to');

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

const eliminar_tasa_cambio = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tasa_cambio' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].delete == true) {
                var id = req.params['id'];

                data.compania = req.user.compania;
                var ventas_arr = [];

                ventas_arr = await Venta.find({ tipo_cambio: id });

                if (ventas_arr.length == 0) {
                    let reg = await Tasa_cambio.findByIdAndRemove({ _id: id });

                    //Log de eliminar
                    LogController.log_delete("tasa_cambio", req.user.sub, req.user.compania, reg._id);

                    res.status(200).send({ data: reg });
                }
                else {
                    res.status(200).send({ code: 1004, message: 'No se puede eliminar la tasa de cambio, existen (' + ventas_arr.length + ') ventas con esta tasa de cambio', data: undefined });
                }
            }
            else {
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

const obtener_tasa_cambio = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tasa_cambio' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {
                var id = req.params['id'];
                try {
                    var reg = await Tasa_cambio.findById({ _id: id });

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

const actualizar_tasa_cambio = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tasa_cambio' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].edit == true) {
                let id = req.params['id'];
                var data = req.body;

                let reg = await Tasa_cambio.findByIdAndUpdate({ _id: id }, data);

                //Log de actualizar
                LogController.log_edit("tasa_cambio", data, req.user.sub, req.user.compania, reg._id);

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

//Caja
const registro_caja = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'cajas' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].add == true) {
                var data = req.body;

                data.compania = req.user.compania;
                let reg = await Caja.create(data);

                //log de Registro
                LogController.log_create("cajas", data, req.user.sub, req.user.compania, reg._id);

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

const listar_caja = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'cajas' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {

                var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                let filtro = req.params['filtro'];

                let reg = await Caja.find({ compania: req.user.compania, descripcion: new RegExp(filtro, 'i') }).populate('sucursal');

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

const eliminar_caja = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'cajas' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].delete == true) {
                var id = req.params['id'];

                var ventas_arr = [];
                var proceso_caja_arr = [];

                //Buscar Ventas
                ventas_arr = await Venta.find({ caja: id });
                if (ventas_arr.length == 0) {

                    //Buscar Proceso de caja
                    proceso_caja_arr = await Proceso_caja.find({ caja: id });
                    if (proceso_caja_arr.length == 0) {
                        let reg = await Caja.findByIdAndRemove({ _id: id });

                        //Log de eliminar
                        LogController.log_delete("cajas", req.user.sub, req.user.compania, reg._id);

                        res.status(200).send({ data: reg });
                    }
                    else {
                        res.status(200).send({ code: 1004, message: 'No se puede eliminar la caja, existen (' + proceso_caja_arr.length + ') proceso_caja con esta caja', data: undefined });
                    }
                }
                else {
                    res.status(200).send({ code: 1004, message: 'No se puede eliminar la caja, existen (' + ventas_arr.length + ') ventas con esta caja', data: undefined });
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

const obtener_caja = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'cajas' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {
                var id = req.params['id'];
                try {
                    var reg = await Caja.findById({ _id: id });

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

const actualizar_caja = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'cajas' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].edit == true) {
                let id = req.params['id'];
                var data = req.body;

                data.compania = req.user.compania;
                let reg = await Caja.findByIdAndUpdate({ _id: id }, data);

                //Log de actualizar
                LogController.log_edit("cajas", data, req.user.sub, req.user.compania, reg._id);
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

//Medio Pago
const registro_medio_pago = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'medios_pago' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].add == true) {
                var data = req.body;

                data.compania = req.user.compania;
                let reg = await Medio_pago.create(data);

                //log de Registro
                LogController.log_create("medios_pago", data, req.user.sub, req.user.compania, reg._id);

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

const listar_medio_pago = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'medios_pago' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {
                
                var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                let filtro = req.params['filtro'];

                let reg = await Medio_pago.find({ compania: req.user.compania, descripcion: new RegExp(filtro, 'i') }).populate('sucursal');

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

const eliminar_medio_pago = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'medios_pago' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].delete == true) {
                var id = req.params['id'];

                var ventas_arr = [];

                ventas_arr = await Venta.find({ medio_pago: id });

                if (ventas_arr.length == 0) {
                    let reg = await Medio_pago.findByIdAndRemove({ _id: id });

                    //Log de eliminar
                    LogController.log_delete("medios_pago", req.user.sub, req.user.compania, reg._id);

                    res.status(200).send({ data: reg });
                }
                else {
                    res.status(200).send({ code: 1004, message: 'No se puede eliminar el medios de pago, existen (' + ventas_arr.length + ') ventas con este medios de pago', data: undefined });
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

const obtener_medio_pago = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'medios_pago' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {
                var id = req.params['id'];
                try {
                    var reg = await Medio_pago.findById({ _id: id });

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

const actualizar_medio_pago = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'medios_pago' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].edit == true) {
                let id = req.params['id'];
                var data = req.body;

                data.compania = req.user.compania;
                let reg = await Medio_pago.findByIdAndUpdate({ _id: id }, data);

                //Log de actualizar
                LogController.log_edit("medios_pago", data, req.user.sub, req.user.compania, reg._id);

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

//Bancos
const registro_banco = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'bancos' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].add == true) {
                var data = req.body;

                data.compania = req.user.compania;
                let reg = await Banco.create(data);

                //log de Registro
                LogController.log_create("bancos", data, req.user.sub, req.user.compania, reg._id);

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

const listar_banco = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'bancos' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {

                var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                let filtro = req.params['filtro'];

                let reg = await Banco.find({ compania: req.user.compania, descripcion: new RegExp(filtro, 'i') });

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

const eliminar_banco = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'bancos' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].delete == true) {
                var id = req.params['id'];

                let reg = await Banco.findByIdAndRemove({ _id: id });

                //Log de eliminar
                LogController.log_delete("bancos", req.user.sub, req.user.compania, reg._id);

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

const obtener_banco = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'bancos' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {
                var id = req.params['id'];
                try {
                    var reg = await Banco.findById({ _id: id });

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

const actualizar_banco = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'bancos' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].edit == true) {
                let id = req.params['id'];
                var data = req.body;

                data.compania = req.user.compania;
                let reg = await Banco.findByIdAndUpdate({ _id: id }, data);

                //Log de actualizar
                LogController.log_edit("bancos", data, req.user.sub, req.user.compania, reg._id);
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

//Tarjeta
const registro_tarjetas = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tarjetas' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].add == true) {
                var data = req.body;

                data.compania = req.user.compania;
                let reg = await Tarjeta.create(data);

                //log de Registro
                LogController.log_create("tarjetas", data, req.user.sub, req.user.compania, reg._id);

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

const listar_tarjetas = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tarjetas' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {

                var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                let filtro = req.params['filtro'];

                let reg = await Tarjeta.find({ compania: req.user.compania, descripcion: new RegExp(filtro, 'i') }).populate('sucursal');

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

const eliminar_tarjetas = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tarjetas' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].delete == true) {
                var id = req.params['id'];

                let reg = await Tarjeta.findByIdAndRemove({ _id: id });

                //Log de eliminar
                LogController.log_delete("tarjetas", req.user.sub, req.user.compania, reg._id);

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

const obtener_tarjetas = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tarjetas' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {
                var id = req.params['id'];
                try {
                    var reg = await Tarjeta.findById({ _id: id });

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

const actualizar_tarjetas = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tarjetas' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].edit == true) {
                let id = req.params['id'];
                var data = req.body;

                data.compania = req.user.compania;
                let reg = await Tarjeta.findByIdAndUpdate({ _id: id }, data);

                //Log de actualizar
                LogController.log_edit("tarjetas", data, req.user.sub, req.user.compania, reg._id);
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

//Turnos
const registro_turnos = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'turnos' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].add == true) {
                var data = req.body;

                let reg = await Turno.create(data);

                //log de Registro
                LogController.log_create("turnos", data, req.user.sub, req.user.compania, reg._id);

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

const listar_turnos = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'turnos' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {
                var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                let filtro = req.params['filtro'];

                let reg = await Turno.find({ compania: req.user.compania, descripcion: new RegExp(filtro, 'i') }).populate('sucursal');

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

const eliminar_turnos = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'turnos' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].delete == true) {
                var id = req.params['id'];

                var proceso_caja_arr = [];

                proceso_caja_arr = await Proceso_caja.find({ turno: id });

                if (proceso_caja_arr.length == 0) {
                    let reg = await Turno.findByIdAndRemove({ _id: id });

                    //Log de eliminar
                    LogController.log_delete("turnos", req.user.sub, req.user.compania, reg._id);

                    res.status(200).send({ data: reg });
                }
                else {
                    res.status(200).send({ code: 1004, message: 'No se puede eliminar el turno, existen (' + proceso_caja_arr.length + ') proceso caja con este turno', data: undefined });
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

const obtener_turnos = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'turnos' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {
                var id = req.params['id'];
                try {
                    var reg = await Turno.findById({ _id: id });

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

const actualizar_turnos = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'turnos' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].edit == true) {
                let id = req.params['id'];
                var data = req.body;

                let reg = await Turno.findByIdAndUpdate({ _id: id }, data);

                //Log de actualizar
                LogController.log_edit("turnos", data, req.user.sub, req.user.compania, reg._id);
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

//Proceso_caja
const registro_proceso_caja = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'proceso_caja' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].add == true) {
                var data = req.body;

                data.compania = req.user.compania;
                let reg = await Proceso_caja.create(data);

                //log de Registro
                LogController.log_create("proceso_caja", data, req.user.sub, req.user.compania, reg._id);

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

const listar_proceso_caja = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'proceso_caja' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {

                var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                let filtro = req.params['filtro'];

                let reg = await Proceso_caja.find({ compania: req.user.compania, descripcion: new RegExp(filtro, 'i') });

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

const eliminar_proceso_caja = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'proceso_caja' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].delete == true) {
                var id = req.params['id'];

                let reg = await Proceso_caja.findByIdAndRemove({ _id: id });

                //Log de eliminar
                LogController.log_delete("proceso_caja", req.user.sub, req.user.compania, reg._id);

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

const obtener_proceso_caja = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'proceso_caja' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {
                var id = req.params['id'];
                try {
                    var reg = await Proceso_caja.findById({ _id: id });

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

const actualizar_proceso_caja = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'proceso_caja' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].edit == true) {
                let id = req.params['id'];
                var data = req.body;

                data.compania = req.user.compania;
                let reg = await Proceso_caja.findByIdAndUpdate({ _id: id }, data);

                //Log de actualizar
                LogController.log_edit("proceso_caja", data, req.user.sub, req.user.compania, reg._id);
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

//Tipos de documentos
const registro_tipo_documento = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tipo_documento' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].add == true) {
                    var data = req.body;

                    data.compania = req.user.compania;
                    let reg = await Tipo_documento.create(data);

                    //log de Registro
                    LogController.log_create("tipo_documento", data, req.user.sub, req.user.compania, reg._id);

                    res.status(200).send({ data: reg });
                }
                else {
                    res.status(500).send({ message: 'NoAccess' });
                }
            }
            else {
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

const listar_tipo_documento = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tipo_documento' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].read == true) {

                    var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                    let filtro = req.params['filtro'];

                    let reg = await Tipo_documento.find({ compania: req.user.compania, descripcion: new RegExp(filtro, 'i') });

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
        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } catch (error) {
        res.status(400).send({ message: error });
    }
}

const eliminar_tipo_documento = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tipo_documento' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].delete == true) {
                    var id = req.params['id'];

                    var clientes_arr = [];
                    var doctores_arr = [];
                    var proveedores_arr = [];

                    //Buscar clientes
                    clientes_arr = await Cliente.find({ tipo_documento: id });
                    if (clientes_arr.length == 0) {

                        //Buscar doctores
                        doctores_arr = await Doctor.find({ tipo_documento: id });
                        if (doctores_arr.length == 0) {

                            //Buscar proveedores
                            proveedores_arr = await Proveedor.find({ tipo_documento: id });
                            if (proveedores_arr.length == 0) {
                                let reg = await Tipo_documento.findByIdAndRemove({ _id: id });

                                //Log de eliminar
                                LogController.log_delete("tipo_documento", req.user.sub, req.user.compania, reg._id);

                                res.status(200).send({ data: reg });
                            }
                            else {
                                res.status(200).send({ code: 1004, message: 'No se puede eliminar el tipo de docuemnto, existen (' + proveedores_arr.length + ') proveedores con  este tipo de docuemnto', data: undefined });
                            }
                        }
                        else {
                            res.status(200).send({ code: 1004, message: 'No se puede eliminar el tipo de docuemnto, existen (' + doctores_arr.length + ') doctores con  este tipo de docuemnto', data: undefined });
                        }
                    }
                    else {
                        res.status(200).send({ code: 1004, message: 'No se puede eliminar el tipo de docuemnto, existen (' + clientes_arr.length + ') clientes con este tipo de docuemnto', data: undefined });
                    }
                }
                else {
                    res.status(500).send({ message: 'NoAccess' });
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

const obtener_tipo_documento = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tipo_documento' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].read == true) {
                    var id = req.params['id'];
                    try {
                        var reg = await Tipo_documento.findById({ _id: id });

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
        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } catch (error) {
        res.status(400).send({ message: error });
    }
}

const actualizar_tipo_documento = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tipo_documento' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].edit == true) {
                    let id = req.params['id'];
                    var data = req.body;

                    data.compania = req.user.compania;
                    let reg = await Tipo_documento.findByIdAndUpdate({ _id: id }, data);

                    //Log de actualizar
                    LogController.log_edit("tipo_documento", data, req.user.sub, req.user.compania, reg._id);
                    res.status(200).send({ data: data });
                }
                else {
                    res.status(500).send({ message: 'NoAccess' });
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

//Tipo de cliente
const registro_tipo_cliente = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tipo_cliente' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].add == true) {
                    var data = req.body;

                    data.compania = req.user.compania;
                    let reg = await Tipo_cliente.create(data);

                    //log de Registro
                    LogController.log_create("tipo_cliente", data, req.user.sub, req.user.compania, reg._id);

                    res.status(200).send({ data: reg });
                }
                else {
                    res.status(500).send({ message: 'NoAccess' });
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

const listar_tipo_cliente = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tipo_cliente' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].read == true) {

                    var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                    let filtro = req.params['filtro'];

                    let reg = await Tipo_cliente.find({ compania: req.user.compania, descripcion: new RegExp(filtro, 'i') });

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
        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } catch (error) {
        res.status(400).send({ message: error });
    }
}

const eliminar_tipo_cliente = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tipo_cliente' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].delete == true) {
                    var id = req.params['id'];

                    var cliente_arr = [];

                    cliente_arr = await Cliente.find({ tipo_cliente: id });

                    if (cliente_arr.length == 0) {
                        let reg = await Tipo_cliente.findByIdAndRemove({ _id: id });

                        //Log de eliminar
                        LogController.log_delete("tipo_cliente", req.user.sub, req.user.compania, reg._id);

                        res.status(200).send({ data: reg });
                    }
                    else {
                        res.status(200).send({ code: 1004, message: 'No se puede eliminar el tipo de cliente, existen (' + cliente_arr.length + ') clientes caja con este tipo de cliente', data: undefined });
                    }
                }
                else {
                    res.status(500).send({ message: 'NoAccess' });
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

const obtener_tipo_cliente = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tipo_cliente' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].read == true) {
                    var id = req.params['id'];
                    try {
                        var reg = await Tipo_cliente.findById({ _id: id });

                        res.status(200).send({ data: reg });
                    }
                    catch (error) {
                        res.status(200).send({ data: undefined });
                    }
                }
                else {
                    res.status(500).send({ message: 'NoAccess' });
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

const actualizar_tipo_cliente = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tipo_cliente' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].edit == true) {
                    let id = req.params['id'];
                    var data = req.body;

                    data.compania = req.user.compania;
                    let reg = await Tipo_cliente.findByIdAndUpdate({ _id: id }, data);

                    //Log de actualizar
                    LogController.log_edit("tipo_cliente", data, req.user.sub, req.user.compania, reg._id);

                    res.status(200).send({ data: data });
                }
                else {
                    res.status(500).send({ message: 'NoAccess' });
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

//Termino de pago
const registro_termino_pago = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'termino_pago' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].add == true) {
                    var data = req.body;

                    data.compania = req.user.compania;
                    let reg = await Termino_pago.create(data);

                    //log de Registro
                    LogController.log_create("termino_pago", data, req.user.sub, req.user.compania, reg._id);

                    res.status(200).send({ data: reg });
                }
                else {
                    res.status(500).send({ message: 'NoAccess' });
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

const listar_termino_pago = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'termino_pago' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].read == true) {

                    var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                    let filtro = req.params['filtro'];

                    let reg = await Termino_pago.find({ compania: req.user.compania, descripcion: new RegExp(filtro, 'i') });

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
        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } catch (error) {
        res.status(400).send({ message: error });
    }
}

const eliminar_termino_pago = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'termino_pago' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].delete == true) {
                    var id = req.params['id'];
                    
                    var clientes_arr = [];
                    var proveedores_arr = [];

                    //Buscar clientes
                    clientes_arr = await Cliente.find({ termino_pago: id });
                    if (clientes_arr.length == 0) {

                        //Buscar proveedores
                        proveedores_arr = await Proveedor.find({ termino_pago: id });
                        if (proveedores_arr.length == 0) {

                            let reg = await Termino_pago.findByIdAndRemove({ _id: id });

                            //Log de eliminar
                            LogController.log_delete("termino_pago", req.user.sub, req.user.compania, reg._id);

                            res.status(200).send({ data: reg });
                        }
                        else {
                            res.status(200).send({ code: 1004, message: 'No se puede eliminar el termino de pago, existen (' + clientes_arr.length + ') clientes con este termino de pago', data: undefined });
                        }
                    }
                    else {
                        res.status(200).send({ code: 1004, message: 'No se puede eliminar el termino de pago, existen (' + clientes_arr.length + ') clientes con este termino de pago', data: undefined });
                    }
                }
                else {
                    res.status(500).send({ message: 'NoAccess' });
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

const obtener_termino_pago = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'termino_pago' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].read == true) {
                    var id = req.params['id'];
                    try {

                        var reg = await Termino_pago.findById({ _id: id });

                        res.status(200).send({ data: reg });
                    }
                    catch (error) {
                        res.status(200).send({ data: undefined });
                    }
                }
                else {
                    res.status(500).send({ message: 'NoAccess' });
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

const actualizar_termino_pago = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'termino_pago' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].edit == true) {
                    let id = req.params['id'];
                    var data = req.body;

                    data.compania = req.user.compania;
                    let reg = await Termino_pago.findByIdAndUpdate({ _id: id }, data);

                    //Log de actualizar
                    LogController.log_edit("termino_pago", data, req.user.sub, req.user.compania, reg._id);

                    res.status(200).send({ data: data });
                }
                else {
                    res.status(500).send({ message: 'NoAccess' });
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

//Itbis 
const registro_itbis = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'itbis' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].add == true) {
                    var data = req.body;
                    
                    data.compania = req.user.compania;
                    console.log(Itbis.toString());
                    let reg = await Itbis.create(data);

                    //log de Registro
                    LogController.log_create("itbis", data, req.user.sub, req.user.compania, reg._id);

                    res.status(200).send({ data: reg });
                }
                else {
                    res.status(500).send({ message: 'NoAccess' });
                }
            }
            else {
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

const listar_itbis = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'itbis' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].read == true) {

                    var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                    let filtro = req.params['filtro'];

                    let reg = await Itbis.find(
                        { compania: req.user.compania, 
                           descripcion: new RegExp(filtro, 'i') }
                        ).populate('detalles')
                        .populate({
                            path: 'detalles.tipo_itbis',
                            model: 'tipo_itbis'
                        })

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
            }
            else {
                res.status(500).send({ message: 'NoAccess' });
            }
        }
        else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error });
    }
}

const eliminar_itbis = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'itbis' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].delete == true) {
                    var id = req.params['id'];

                    var ventas_arr = [];

                    ventas_arr = await Venta_Detalle.find({ itbis: id });
                    
                    if (ventas_arr.length == 0) {
                        let reg = await Itbis.findByIdAndRemove({ _id: id });

                        //Log de eliminar
                        LogController.log_delete("itbis", req.user.sub, req.user.compania, reg._id);

                        res.status(200).send({ data: reg });
                    }
                    else {
                        res.status(200).send({ code: 1004, message: 'No se puede eliminar el Itbis, existen (' + ventas_arr.length + ') ventas con este Itbis', data: undefined });
                    }
                }
                else {
                    res.status(500).send({ message: 'NoAccess' });
                }
            }
            else {
                res.status(500).send({ message: 'NoAccess' });
            }
        }
        else {
            res.status(500).send({ message: 'NoAccess' });
        }
    }
    catch (error) {
        res.status(400).send({ message: error });
    }
}

const obtener_itbis = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'itbis' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].read == true) {
                    var id = req.params['id'];
                    try {
                        var reg = await Itbis.findById({ _id: id });

                        res.status(200).send({ data: reg });
                    }
                    catch (error) {
                        res.status(200).send({ data: undefined });
                    }
                }
                else {
                    res.status(500).send({ message: 'NoAccess' });
                }
            }
            else {
                res.status(500).send({ message: 'NoAccess' });
            }
        }
        else {
            res.status(500).send({ message: 'NoAccess' });
        }
    }
    catch (error) {
        res.status(400).send({ message: error });
    }
}

const actualizar_itbis = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'itbis' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].edit == true) {
                    let id = req.params['id'];
                    var data = req.body;

                    data.compania = req.user.compania;
                    let reg = await Itbis.findByIdAndUpdate({ _id: id }, data);

                    //Log de actualizar
                    LogController.log_edit("itbis", data, req.user.sub, req.user.compania, reg._id);

                    res.status(200).send({ data: data });
                }
                else {
                    res.status(500).send({ message: 'NoAccess' });
                }
            }
            else {
                res.status(500).send({ message: 'NoAccess' });
            }
        }
        else {
            res.status(500).send({ message: 'NoAccess' });
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ message: error });
    }
}

//Itbis 
const registro_tipo_itbis = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tipo_itbis' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].add == true) {
                    var data = req.body;

                    let exist = await Tipo_itbis.findOne({ code: data.code });

                    if(!exist)
                    {
                        data.compania = req.user.compania;
                        let reg = await Tipo_itbis.create(data);
    
                        //log de Registro
                        LogController.log_create("tipo_itbis", data, req.user.sub, req.user.compania, reg._id);
    
                        res.status(200).send({ data: reg });
                    }
                    else{
                        res.status(500).send({ message: 'Existe un tipo de impuesto con este código' });
                    }
                }
                else {
                    res.status(500).send({ message: 'NoAccess' });
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

const listar_tipo_itbis = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tipo_itbis' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].read == true) {

                    var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                    let filtro = req.params['filtro'];

                    let reg = await Tipo_itbis.find({ compania: req.user.compania, descripcion: new RegExp(filtro, 'i') });

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
            }
            else {
                res.status(500).send({ message: 'NoAccess' });
            }
        }
        else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error });
    }
}

const eliminar_tipo_itbis = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tipo_itbis' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].delete == true) {
                    var id = req.params['id'];

                    var ventas_arr = [];

                    ventas_arr = await Itbis.find({ tipo_itbis: id });
                    
                    if (ventas_arr.length == 0) {
                        let reg = await Tipo_itbis.findByIdAndRemove({ _id: id });

                        //Log de eliminar
                        LogController.log_delete("tipo_itbis", req.user.sub, req.user.compania, reg._id);

                        res.status(200).send({ data: reg });
                    }
                    else {
                        res.status(200).send({ code: 1004, message: 'No se puede eliminar el tipo itbis, existen (' + ventas_arr.length + ') ventas con este Itbis', data: undefined });
                    }
                }
                else {
                    res.status(500).send({ message: 'NoAccess' });
                }
            }
            else {
                res.status(500).send({ message: 'NoAccess' });
            }
        }
        else {
            res.status(500).send({ message: 'NoAccess' });
        }
    }
    catch (error) {
        res.status(400).send({ message: error });
    }
}

const obtener_tipo_itbis = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tipo_itbis' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].read == true) {
                    var id = req.params['id'];
                    try {
                        var reg = await Tipo_itbis.findById({ _id: id });

                        res.status(200).send({ data: reg });
                    }
                    catch (error) {
                        res.status(200).send({ data: undefined });
                    }
                }
                else {
                    res.status(500).send({ message: 'NoAccess' });
                }
            }
            else {
                res.status(500).send({ message: 'NoAccess' });
            }
        }
        else {
            res.status(500).send({ message: 'NoAccess' });
        }
    }
    catch (error) {
        res.status(400).send({ message: error });
    }
}

const actualizar_tipo_itbis = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tipo_itbis' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].edit == true) {
                    let id = req.params['id'];
                    var data = req.body;

                    data.compania = req.user.compania;
                    let reg = await Tipo_itbis.findByIdAndUpdate({ _id: id }, data);

                    //Log de actualizar
                    LogController.log_edit("tipo_itbis", data, req.user.sub, req.user.compania, reg._id);

                    res.status(200).send({ data: data });
                }
                else {
                    res.status(500).send({ message: 'NoAccess' });
                }
            }
            else {
                res.status(500).send({ message: 'NoAccess' });
            }
        }
        else {
            res.status(500).send({ message: 'NoAccess' });
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ message: error });
    }
}

//tipo_ingreso 
const registro_tipo_ingreso = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tipo_ingreso' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].add == true) {
                    var data = req.body;

                    data.compania = req.user.compania;
                    let reg = await Tipo_ingreso.create(data);

                    //log de Registro
                    LogController.log_create("tipo_ingreso", data, req.user.sub, req.user.compania, reg._id);

                    res.status(200).send({ data: reg });
                }
                else {
                    res.status(500).send({ message: 'NoAccess' });
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

const listar_tipo_ingreso = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tipo_ingreso' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].read == true) {

                    var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                    let filtro = req.params['filtro'];

                    let reg = await Tipo_ingreso.find({ compania: req.user.compania, descripcion: new RegExp(filtro, 'i') });

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
            }
            else {
                res.status(500).send({ message: 'NoAccess' });
            }
        }
        else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } catch (error) {
        res.status(400).send({ message: error });
    }
}

const eliminar_tipo_ingreso = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tipo_ingreso' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].delete == true) {
                    var id = req.params['id'];

                    var ventas_arr = [];

                    ventas_arr = await Venta.find({ itbis: id });

                    if (ventas_arr.length == 0) {
                        let reg = await Tipo_ingreso.findByIdAndRemove({ _id: id });

                        //Log de eliminar
                        LogController.log_delete("tipo_ingreso", req.user.sub, req.user.compania, reg._id);

                        res.status(200).send({ data: reg });
                    }
                    else {
                        res.status(200).send({ code: 1004, message: 'No se puede eliminar el Tipo de ingreso, existen (' + ventas_arr.length + ') ventas con este Tipo de ingreso', data: undefined });
                    }
                }
                else {
                    res.status(500).send({ message: 'NoAccess' });
                }
            }
            else {
                res.status(500).send({ message: 'NoAccess' });
            }
        }
        else {
            res.status(500).send({ message: 'NoAccess' });
        }
    }
    catch (error) {
        res.status(400).send({ message: error });
    }
}

const obtener_tipo_ingreso = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tipo_ingreso' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].read == true) {
                    var id = req.params['id'];
                    try {
                        var reg = await Tipo_ingreso.findById({ _id: id });

                        res.status(200).send({ data: reg });
                    }
                    catch (error) {
                        res.status(200).send({ data: undefined });
                    }
                }
                else {
                    res.status(500).send({ message: 'NoAccess' });
                }
            }
            else {
                res.status(500).send({ message: 'NoAccess' });
            }
        }
        else {
            res.status(500).send({ message: 'NoAccess' });
        }
    }
    catch (error) {
        res.status(400).send({ message: error });
    }
}

const actualizar_tipo_ingreso = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'tipo_ingreso' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].edit == true) {
                    let id = req.params['id'];
                    var data = req.body;    

                    data.compania = req.user.compania;
                    let reg = await Tipo_ingreso.findByIdAndUpdate({ _id: id }, data);

                    //Log de actualizar
                    LogController.log_edit("tipo_ingreso", data, req.user.sub, req.user.compania, reg._id);
                    res.status(200).send({ data: data });
                }
                else {
                    res.status(500).send({ message: 'NoAccess' });
                }
            }
            else {
                res.status(500).send({ message: 'NoAccess' });
            }
        }
        else {
            res.status(500).send({ message: 'NoAccess' });
        }
    }
    catch (error) {
        res.status(400).send({ message: error });
    }
}

//Condiciones_Pago 
const registro_condiciones_pago = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'condiciones_pago' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].add == true) {
                    var data = req.body;

                    data.compania = req.user.compania;
                    let reg = await Condiciones_Pago.create(data);

                    //log de Registro
                    LogController.log_create("condiciones_pago", data, req.user.sub, req.user.compania, reg._id);

                    res.status(200).send({ data: reg });
                }
                else {
                    res.status(500).send({ message: 'NoAccess' });
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

const listar_condiciones_pago = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'condiciones_pago' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].read == true) {

                    var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                    let filtro = req.params['filtro'];

                    let reg = await Condiciones_Pago.find({ compania: req.user.compania, descripcion: new RegExp(filtro, 'i') });

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
            }
            else {
                res.status(500).send({ message: 'NoAccess' });
            }
        }
        else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } catch (error) {
        res.status(400).send({ message: error });
    }
}

const eliminar_condiciones_pago = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'condiciones_pago' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].delete == true) {
                    var id = req.params['id'];

                    var ventas_arr = [];

                    ventas_arr = await Venta.find({ condicion_pago: id });

                    if (ventas_arr.length == 0) {
                        let reg = await Condiciones_Pago.findByIdAndRemove({ _id: id });

                        //Log de eliminar
                        LogController.log_delete("tipo_ingreso", req.user.sub, req.user.compania, reg._id);

                        res.status(200).send({ data: reg });
                    }
                    else {
                        res.status(200).send({ code: 1004, message: 'No se puede eliminar la condición de pago, existen (' + ventas_arr.length + ') ventas con esta condición de pago', data: undefined });
                    }
                }
                else {
                    res.status(500).send({ message: 'NoAccess' });
                }
            }
            else {
                res.status(500).send({ message: 'NoAccess' });
            }
        }
        else {
            res.status(500).send({ message: 'NoAccess' });
        }
    }
    catch (error) {
        res.status(400).send({ message: error });
    }
}

const obtener_condiciones_pago = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'condiciones_pago' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].read == true) {
                    var id = req.params['id'];
                    try {
                        var reg = await Condiciones_Pago.findById({ _id: id });

                        res.status(200).send({ data: reg });
                    }
                    catch (error) {
                        res.status(200).send({ data: undefined });
                    }
                }
                else {
                    res.status(500).send({ message: 'NoAccess' });
                }
            }
            else {
                res.status(500).send({ message: 'NoAccess' });
            }
        }
        else {
            res.status(500).send({ message: 'NoAccess' });
        }
    }
    catch (error) {
        res.status(400).send({ message: error });
    }
}

const actualizar_condiciones_pago = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'condiciones_pago' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].edit == true) {
                    let id = req.params['id'];
                    var data = req.body;    

                    data.compania = req.user.compania;
                    let reg = await Condiciones_Pago.findByIdAndUpdate({ _id: id }, data);

                    //Log de actualizar
                    LogController.log_edit("condiciones_pago", data, req.user.sub, req.user.compania, reg._id);
                    res.status(200).send({ data: data });
                }
                else {
                    res.status(500).send({ message: 'NoAccess' });
                }
            }
            else {
                res.status(500).send({ message: 'NoAccess' });
            }
        }
        else {
            res.status(500).send({ message: 'NoAccess' });
        }
    }
    catch (error) {
        res.status(400).send({ message: error });
    }
}

module.exports = {
    registro_tipo_comprobante,
    listar_tipos_comprobantes,
    eliminar_tipo_comprobante,
    obtener_tipo_comprobante,
    actualizar_tipo_comprobante,

    registro_rango_comprobante,
    listar_rango_comprobante,
    eliminar_rango_comprobante,
    obtener_rango_comprobante,
    actualizar_rango_comprobante,

    registro_moneda,
    listar_monedas,
    eliminar_moneda,
    obtener_moneda,
    actualizar_moneda,

    registro_tasa_cambio,
    listar_tasa_cambio,
    eliminar_tasa_cambio,
    obtener_tasa_cambio,
    actualizar_tasa_cambio,

    registro_caja,
    listar_caja,
    eliminar_caja,
    obtener_caja,
    actualizar_caja,

    registro_medio_pago,
    listar_medio_pago,
    eliminar_medio_pago,
    obtener_medio_pago,
    actualizar_medio_pago,

    registro_banco,
    listar_banco,
    eliminar_banco,
    obtener_banco,
    actualizar_banco,

    registro_tarjetas,
    listar_tarjetas,
    eliminar_tarjetas,
    obtener_tarjetas,
    actualizar_tarjetas,

    registro_turnos,
    listar_turnos,
    eliminar_turnos,
    obtener_turnos,
    actualizar_turnos,

    registro_proceso_caja,
    listar_proceso_caja,
    eliminar_proceso_caja,
    obtener_proceso_caja,
    actualizar_proceso_caja,

    registro_tipo_documento,
    listar_tipo_documento,
    eliminar_tipo_documento,
    obtener_tipo_documento,
    actualizar_tipo_documento,

    registro_tipo_cliente,
    listar_tipo_cliente,
    eliminar_tipo_cliente,
    obtener_tipo_cliente,
    actualizar_tipo_cliente,

    registro_termino_pago,
    listar_termino_pago,
    eliminar_termino_pago,
    obtener_termino_pago,
    actualizar_termino_pago,

    registro_itbis,
    listar_itbis,
    eliminar_itbis,
    obtener_itbis,
    actualizar_itbis,

    registro_tipo_ingreso,
    listar_tipo_ingreso,
    eliminar_tipo_ingreso,
    obtener_tipo_ingreso,
    actualizar_tipo_ingreso,

    registro_condiciones_pago,
    listar_condiciones_pago,
    eliminar_condiciones_pago,
    obtener_condiciones_pago,
    actualizar_condiciones_pago,

    registro_tipo_itbis,
    listar_tipo_itbis,
    eliminar_tipo_itbis,
    obtener_tipo_itbis,
    actualizar_tipo_itbis
}