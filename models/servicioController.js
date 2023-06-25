'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');

var multiparty = require('connect-multiparty');

var Orden_Servicio = require('../models/orden_servicio');

var Pagina = require('../models/pagina');
var Rol_Aceeso = require('../models/rol_acceso');
var LogController = require('../controllers/generalController');
var Config_View_Table = require('../models/config_view_table');


//Orden de servicio
const registro_orden_servicio = async function (req, res) {
    try {
        console.log(req.body);
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'orden_servicio' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].add == true) {

                var data = req.body;
                console.log(data);
                data.compania = req.user.compania;
                
                if(req.files){

                    const galeriaObj = [];

                    for (let i = 0; i < data.detalles.length; i++) {
                        const items = data.detalles[i];
    
                        //Galería 
                        req.files.galeria.forEach(element => {
                            var img_path1 = element.path;
                            var name1 = img_path1.split('\\');
                            var img_name1 = name1[2];
                            galeriaObj.push(img_name1);
                        });

                        data.detalles[i].galeria = galeriaObj;
    
                        data.detalles[i] = items; 
                    }
                }

                let reg = await Orden_Servicio.create(data);

                //Log
                LogController.log_create("orden_servicio", data, req.user.sub, req.user.compania, reg._id);

                res.status(200).send({ data: reg });
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

const listar_orden_servicio = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'orden_servicio' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {

                var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                let filtro = req.params['filtro'];

                let reg = await Orden_Servicio.find({ compania: req.user.compania, descripcion: new RegExp(filtro, 'i') });

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

const eliminar_orden_servicio = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'orden_servicio' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].delete == true) {
                var id = req.params['id'];

                let reg = await Orden_Servicio.findByIdAndRemove({ _id: id });
                //Log de eliminar
                LogController.log_delete("orden_servicio", req.user.sub, req.user.compania, reg._id);

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

const obtener_orden_servicio = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'orden_servicio' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {
                var id = req.params['id'];
                try {
                    var reg = await Orden_Servicio.findById({ _id: id });

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

const actualizar_orden_servicio = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'orden_servicio' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].edit == true) {
                let id = req.params['id'];
                var data = req.body;

                data.compania = req.user.compania;
                let reg = await Orden_Servicio.findByIdAndUpdate({ _id: id }, data);

                console.log(id);

                //Log
                LogController.log_edit("orden_servicio", data, req.user.sub, req.user.compania, reg._id);

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

module.exports = {
    registro_orden_servicio,
    listar_orden_servicio,
    eliminar_orden_servicio,
    obtener_orden_servicio,
    actualizar_orden_servicio
}
