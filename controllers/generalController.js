'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');
const puppeteer = require('puppeteer');

var Rol_Aceeso = require('../models/rol_acceso');
var Pagina = require('../models/pagina');

var Log = require('../models/log');
var Log_Item = require('../models/log_item');
var Ticket = require('../models/ticket');

var Config_View_Table = require('../models/config_view_table');
var Config_view_registro = require('../models/config_view_registro');
var Cliente = require('../models/cliente');
const https = require('https');

const log_create = async function(modelo, data, usuario, compania, id){
    try {
        //Log
        var log_data = data;
        log_data.usuario =  usuario;
        log_data.type = 'create';
        log_data.date = Date.now();

        var log_object = {
            id: id,
            changes: log_data
        }

        var log_item = await Log_Item.create(log_object);
        var log_header = {
            modelo: modelo,
            compania: compania,
            log_item: log_item._id
        }

        var log_header_find = await Log.findOne({compania: compania, modelo:modelo});
        if(log_header_find == null){
            await Log.create(log_header);
        }
        //Fin Log
    } 
    catch (error) {
        console.log(error);
    }
}

const log_delete = async function(modelo, usuario, compania, id){
    try {
        //Log
        var log_item = [];
        var log_data = {};
        log_data.usuario =  usuario;
        log_data.type = 'delete';
        log_data.date = Date.now();

        var log_object = {
            id: id,
            changes: log_data
        }

        var log_find = await Log_Item.findOne({id:id});
        if(log_find == null){
             log_item = await Log_Item.create(log_object);
        }
        else{
            log_item = await Log_Item.findByIdAndUpdate({_id:log_find._id},{ $push: { changes: log_data}});
        }

        var log_header = {
            modelo: modelo,
            compania: compania,
            log_item: log_item._id
        }

        var log_header_find = await Log.findOne({compania: compania, modelo:modelo});
        if(log_header_find == null){
            await Log.create(log_header);
        }
        //Fin Log
    } 
    catch (error) {
        console.log(error);
    }
}

const log_edit = async function(modelo, data, usuario, compania, id){
    try {
        //Log
        var log_item = [];
        var log_data = data;
        log_data.usuario = usuario;
        log_data.type = 'edit';
        log_data.date = Date.now();

        var log_object = {
            id: id,
            changes: log_data
        }

        var log_find = await Log_Item.findOne({id:id});
        if(log_find == null){
             log_item = await Log_Item.create(log_object);
        }
        else{
            log_item = await Log_Item.findByIdAndUpdate({_id:log_find._id},{ $push: { changes: log_data}});
        }

        var log_header = {
            modelo: modelo,
            compania: compania,
            log_item: log_item._id
        }

        var log_header_find = await Log.findOne({compania: compania, modelo:modelo});
        if(log_header_find == null){
            await Log.create(log_header);
        }
        //Fin Log
    } 
    catch (error) {
        console.log(error);
    }
}

//Config_View_Table
const registro_config_view_table = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'config_view_table' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].add == true) {
                    var data = req.body;

                    data.compania = req.user.compania;
                    var config_arr = [];

                    config_arr = await Config_View_Table.find({ modelo: data.modelo });

                    if (config_arr.length == 0) {
                        let reg = await Config_View_Table.create(data);
                        res.status(200).send({ data: reg });

                        //Log
                        log_create("config_view_table", data, req.user.sub, req.user.compania, reg._id);

                    }
                    else{
                        res.status(400).send({ message: 'Esta configuración, ya está registrada' });
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
        console.log(error);
        res.status(400).send({ message: error });
    }
}

const listar_config_view_table = async function (req, res) {
    try {
        if (req.user) {

            var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: 'config_view_table' });

            let reg = await Config_View_Table.find({ compania: req.user.compania });

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
    } catch (error) {
        res.status(400).send({ message: error });
    }
}

const eliminar_config_view_table = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'config_view_table' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].delete == true) {
                    var id = req.params['id'];

                    let reg = await Config_View_Table.findByIdAndRemove({ _id: id });

                    //Log de eliminar
                    log_delete("config_view_table", req.user.sub, req.user.compania, reg._id);

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

const obtener_config_view_table = async function (req, res) {
    try {
        if (req.user) {
            var page = req.params['pagina'];
            try {
                var reg = await Config_View_Table.findOne({ modelo: page });

                res.status(200).send({ data: reg });
            }
            catch (error) {
                res.status(200).send({ data: undefined });
            }
        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error });
    }
}

const actualizar_config_view_table = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'config_view_table' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].edit == true) {
                    let id = req.params['id'];
                    var data = req.body;

                    let reg = await Config_View_Table.findByIdAndUpdate({ _id: id }, data);

                    //Log de actualizar
                    log_edit("config_view_table", data, req.user.sub, req.user.compania, reg._id);
                    res.status(200).send({ data: data });
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

//config_view_registro
const registro_config_view_registro = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'config_view_registro' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].add == true) {
                    var data = req.body;

                    data.compania = req.user.compania;
                    let reg = await Config_view_registro.create(data);

                    //Log
                    log_create("config_view_registro", data, req.user.sub, req.user.compania, reg._id);

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

const listar_config_view_registro = async function (req, res) {
    try {
        if (req.user) {

            var config_table = await Config_view_registro.findOne({ compania: req.user.compania, modelo: 'config_view_registro' });

            let reg = await Config_view_registro.find({ compania: req.user.compania });

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
    } catch (error) {
        res.status(400).send({ message: error });
    }
}

const eliminar_config_view_registro = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'config_view_registro' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].delete == true) {
                    var id = req.params['id'];

                    let reg = await Config_view_registro.findByIdAndRemove({ _id: id });

                    //Log de eliminar
                    log_delete("config_view_registro", req.user.sub, req.user.compania, reg._id);

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

const obtener_config_view_registro = async function (req, res) {
    try {
        if (req.user) {
            var page = req.params['pagina'];
            try {
                var reg = await Config_view_registro.findOne({ modelo: page });

                res.status(200).send({ data: reg });
            }
            catch (error) {
                res.status(200).send({ data: undefined });
            }
        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error });
    }
}

const actualizar_config_view_registro = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'config_view_registro' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].edit == true) {
                    let id = req.params['id'];
                    var data = req.body;

                    let reg = await Config_view_registro.findByIdAndUpdate({ _id: id }, data);

                    //Log de actualizar
                    log_edit("config_view_registro", data, req.user.sub, req.user.compania, reg._id);
                    res.status(200).send({ data: data });
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


//Menu
const listar_menu = async function (req, res) {
    try {
        if (req.user) {
            let accesos = await Rol_Aceeso.find({ rol: req.user.role, compania: req.user.compania }).populate('pagina').populate('modulo');

            const groupedArray = accesos.reduce((acc, cur) => {
                const moduloId = cur.modulo.descripcion;
                if (!acc[moduloId]) {
                    acc[moduloId] = {
                        modulo: cur.modulo,
                        pagina: [cur.pagina],
                        acceso: [cur.acceso]
                    };
                } else {
                    acc[moduloId].pagina.push(cur.pagina, cur.acceso);
                }
                return acc;
            }, {});

            res.status(200).send({ data: groupedArray });
        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } catch (error) {
        res.status(400).send({ message: error });
    }
}

//Menu mobile
const listar_menu_mobile = async function (req, res) {
    try {
        if (req.user) {
            let accesos = await Rol_Aceeso.find({ rol: req.user.role, compania: req.user.compania }).populate('pagina').populate('modulo');

            const groupedArray = accesos.map(obj => obj.pagina);

            res.status(200).send({ data: groupedArray });
        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } catch (error) {
        res.status(400).send({ message: error });
    }
}

//Log
const consultar_log = async function (req, res) {
    try {
        if (req.user) {
            //let pagina = await Pagina.findOne({ code: 'logs' });
            //let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            //if (accesos != null) {
                //if (accesos.acceso[0].read == true) {
                    var id = req.params['id'];
                    try {
                        console.log(id);
                        var log_item = await Log_Item.findOne({ id: id });

                        var log_header = await Log.findOne({ compania: req.user.compania, log_item: log_item._id }).populate('log_item');

                        res.status(200).send({ data: log_item });
                    }
                    catch (error) {
                        res.status(200).send({ data: undefined });
                    }
                //}
                //else {
                //    res.status(500).send({ message: 'NoAccess' });
               // }
            //}
            //else {
            //    res.status(500).send({ message: 'NoAccess' });
            //}
        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error });
    }
}

//Consultar cedula new 
const consultar_cedula = async function (req, res) {
    try {
        if (req.user) {
            
            //Leer parametro de cedula
            let cedula = req.params['cedula'];

            const url = 'https://api.adamix.net/apec/cedula/'+cedula;

            https.get(url, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                const result = JSON.parse(data);
                if(!result.ok) return res.status(500).json({ error: { message: "Documento no encontrado." }})
                
                let clienteObj = {
                    // nombre: result.Nombres + ' ' + result.Apellido1 + ' ' + result.Apellido2,
                    nombre: `${result.Nombres || ""}${result.Apellido1 ? ` ${result.Apellido1}`: ""}${result.Apellido2 ? ` ${result.Apellido2}`: ""}`,
                    fecha_nacimiento: result.FechaNacimiento,
                    lugar_nacimiento: result.LugarNacimiento,
                    genero: result.IdSexo,
                    estado_civil: result.IdEstadoCivil,
                    foto: result.foto,
                    documento: result.Cedula,
                }
                res.status(200).send({ data: clienteObj });
            });

            }).on('error', (error) => {
            console.error(error);
            })
        }
    }
    catch (error) {
        console.log(error);
        res.status(200).send({ data: undefined });
    }
}
//Consultar cedula
const consultar_cedula_old = async function (req, res) {
    try {
        if (req.user) {
            try {
                //Leer parametro de cedula
                let cedula = req.params['cedula'];

                let cliente = await Cliente.findOne({ documento: cedula });
                if (cliente != null) {
                    let result = {
                        _id: cliente._id,
                        nombre: cliente.nombre,
                        telefono: cliente.telefono,
                        compania: req.user.compania,
                        documento: cliente.documento
                    }
                    console.log('2');
                    res.status(200).send({ data: result });
                }
                else {
                    //Inicializar variables
                    const browser = await puppeteer.launch();
                    const page = await browser.newPage();
                    //Dirigirnos a la pagina
                    await page.goto('https://dgii.gov.do/app/WebApps/ConsultasWeb/consultas/ciudadanos.aspx', { waitUntil: 'networkidle2' });
                    //Colocar cedula
                    await page.type('#ctl00_cphMain_txtCedula', cedula);
                    //Clickear boton de buscar 
                    await page.click('#ctl00_cphMain_btnBuscarCedula');
                    //Esperar resultado
                    try {
                        await page.waitForSelector('#ctl00_cphMain_dvResultadoCedula', { timeout: 3000 });
                        let nombre = await page.$eval('#ctl00_cphMain_dvResultadoCedula tbody tr:first-child td:nth-child(2)', td => td.innerText);
                        //Cerrar conexion
                        console.log(nombre);
                        await browser.close();

                        let result = {
                            nombre: nombre,
                            documento: cedula
                        }

                        res.status(200).send({ data: result });
                    } catch (e) {
                        await page.waitForSelector('#ctl00_cphMain_divAlertDanger');
                        let message = await page.$eval('#ctl00_cphMain_divAlertDanger', el => el.innerText);
                        res.status(400).send({ message });
                    }

                }
            }
            catch (error) {
                console.log(error);
                res.status(200).send({ data: undefined });
            }
        }
        else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } catch (error) {
        res.status(400).send({ message: error });
    }
}

//Guardar cliente dispositivo
const guardar_cliente_dispositivo = async function (req, res) {
    try {
        if (req.user) {
            try {
                //Leer body
                var data = req.body;
                let cliente = await Cliente.findOne({ documento: data.documento });
                if (cliente) {
                    data._id = cliente._id;
                }
                if (data._id) {
                    let reg = await Cliente.findByIdAndUpdate({ _id: data._id }, data);

                    let ticket = {
                        compania: req.user.compania,
                        cliente: reg._id,
                        estatus: true
                    }

                    var data = await crear_ticket(ticket);

                    //Log
                    log_create("ticket", data, req.user.sub, req.user.compania, data._id);

                    if (data != null) {
                        res.status(200).send({ data: data });
                    }
                    else {
                        res.status(400).send({ message: "Error al crear el ticket" });
                    }
                }
                else {
                    data.compania = req.user.compania;
                    data.descripcion = data.nombre;
                    data.estatus = true;
                    let reg = await Cliente.create(data);

                    let ticket = {
                        compania: req.user.compania,
                        cliente: reg._id,
                        estatus: true
                    }

                    var data = await crear_ticket(ticket);

                    if (data != null) {
                        res.status(200).send({ data: data });
                    }
                    else {
                        res.status(400).send({ message: "Error al crear el ticket" });
                    }

                }
            }
            catch (error) {
                console.log(error);
                res.status(200).send({ message: error });
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

//Crear ticket
const crear_ticket = async function (data) {
    try {
        //Fecha today
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

        //Buscar ticket anteriores
        let ticket_anterior = await Ticket.findOne({ fecha: { $gte: start, $lt: end } }).sort({ code: -1 });

        //Buscar el más alto
        if (ticket_anterior != null) {
            data.code = ticket_anterior.code + 1;
        }
        else {
            data.code = 1;
        }

        let reg = await Ticket.create(data);

        return reg

    } catch (error) {
        console.log(error);
    }
}

//Crear ticket
const listar_ticket = async function (req, res) {
    try {
        //Fecha today
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

        //Buscar ticket anteriores
        let tickets = await Ticket.find({ fecha: { $gte: start, $lt: end } }).populate('cliente');

        return res.status(200).send({ data: tickets });

    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    log_create,
    log_delete,
    log_edit,

    //Config_view_Table
    registro_config_view_table,
    listar_config_view_table,
    eliminar_config_view_table,
    obtener_config_view_table,
    actualizar_config_view_table,

    listar_menu,
    listar_menu_mobile,

    consultar_log,

    consultar_cedula,

    crear_ticket,

    guardar_cliente_dispositivo,
    
    listar_ticket
}