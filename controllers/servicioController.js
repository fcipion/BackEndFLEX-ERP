'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');
const { request, response } = require("express")
const { ObjectId } = require('mongodb');

var multiparty = require('connect-multiparty');

var Orden_Servicio = require('../models/orden_servicio');

var Pagina = require('../models/pagina');
var Rol_Aceeso = require('../models/rol_acceso');
var LogController = require('../controllers/generalController');
var Config_View_Table = require('../models/config_view_table');

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
const registro_orden_servicio = async function (req, res) {
    if (!req.user) return res.status(500).send({ message: 'NoAccess' });

    let detalles = [];
    const data = req.body;

    data.compania = req?.user?.compania || "";

    try {
        let pagina = await Pagina.findOne({ code: 'orden_servicio' });
        let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
        if (!accesos || accesos.acceso[0].add != true) return res.status(500).send({ message: 'NoAccess' });

        detalles = JSON.parse(data.detalles);
        // if(req.files){

        //     if (typeof data.detalles === 'string') {
        //         detalles = JSON.parse(data.detalles);
        //     } else {
        //         detalles = data.detalles.map(detalle => JSON.parse(detalle));
        //     }

        //     for (let i = 0; i < detalles.length; i++) {
        //         const items = detalles[i];
        //         const galeriaObj = [];

        //         const filesForThisItem = req.files[`galeria_${items.line_id}`];
        //         if (filesForThisItem) {
        //             if (Array.isArray(filesForThisItem)) {
        //                 // Si hay varios archivos para este item, los añadimos todos
        //                 filesForThisItem.forEach(file => {
        //                     var img_path1 = file.path;
        //                     var name1 = img_path1.split('\\');
        //                     var img_name1 = name1[2];
        //                     galeriaObj.push(img_name1);
        //                 });
        //             } else {
        //                 // Si solo hay un archivo, lo añadimos
        //                 var img_path1 = filesForThisItem.path;
        //                 var name1 = img_path1.split('\\');
        //                 var img_name1 = name1[2];
        //                 galeriaObj.push(img_name1);
        //             }
        //         }

        //         detalles[i].galeria = galeriaObj;

        //         detalles[i] = items; 
        //     }
        // }
        data.detalles = detalles
        let reg = await Orden_Servicio.create(data);

        //Log
        LogController.log_create("orden_servicio", data, req.user.sub, req.user.compania, reg._id);

        res.status(200).send({ data: reg });

    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error });
    }
}

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
const uploadFileRegisterOrderService = async function (req, res) {
    if (!req.user) return res.status(500).send({ message: 'NoAccess' });

    const { id, detailId } = req.params
    const order = await Orden_Servicio.findOne({ _id: ObjectId(id) });
    if(!order) return res.status(500).json({message: "service order not foud"})

    const files = req.files
    const file = files.file
    const tempPath = file.path;
    const targetDir = path.join(__dirname, '../uploads/order-service', id);
    const fileName = `${new Date().getTime()}-${file.name}`
    const targetPath = path.join(targetDir, fileName);

    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    const readStream = fs.createReadStream(tempPath);
    const writeStream = fs.createWriteStream(targetPath);
    
    readStream.on('error', () => {
        return res.status(500).json({message: "Error moving file"})
    });

    writeStream.on('error', () => {
        return res.status(500).json({message: "Error moving file"})
    });

    writeStream.on('finish', async () => {
        fs.unlinkSync(tempPath); 

        order.detalles.map((d) => {
            if(d.uuid == detailId){
                if(!Array.isArray(d.galeria)){
                    d.galeria = []
                }

                d.galeria.push(fileName)
            }
            return d
        })

        await Orden_Servicio.findOneAndUpdate(
            { _id: ObjectId(id) },
            order,
            { returnOriginal: false }
        );

        res.json({ uploaded: true })
    });

    readStream.pipe(writeStream);
}

const listar_orden_servicio = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'orden_servicio' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {

                var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                let filtro = req.params['filtro'];

                let reg = await Orden_Servicio.find({ compania: req.user.compania, descripcion: new RegExp(filtro, 'i') }).populate("cliente").populate("doctor").populate("vendedor").populate("sucursal");

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
                    var reg = await Orden_Servicio.findById({ _id: id }).populate("cliente").populate("doctor").populate("vendedor").populate("sucursal").populate({ path: 'detalles', populate: { path: 'producto' } }).populate({ path: 'detalles', populate: { path: 'unidad_medida' } }).populate({ path: 'detalles', populate: { path: 'estado' } }).populate({ path: 'detalles', populate: { path: 'almacen' } });

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
                let detalles;
                if (req.files) {

                    if (typeof data.detalles === 'string') {
                        detalles = JSON.parse(data.detalles);
                    } else {
                        detalles = data.detalles.map(detalle => JSON.parse(detalle));
                    }

                    for (let i = 0; i < detalles.length; i++) {
                        const items = detalles[i];
                        const galeriaObj = [];

                        const filesForThisItem = req.files[`galeria_${items.line_id}`];
                        if (filesForThisItem) {
                            if (Array.isArray(filesForThisItem)) {
                                // Si hay varios archivos para este item, los añadimos todos
                                filesForThisItem.forEach(file => {
                                    var img_path1 = file.path;
                                    var name1 = img_path1.split('\\');
                                    var img_name1 = name1[2];
                                    galeriaObj.push(img_name1);
                                });
                            } else {
                                // Si solo hay un archivo, lo añadimos
                                var img_path1 = filesForThisItem.path;
                                var name1 = img_path1.split('\\');
                                var img_name1 = name1[2];
                                galeriaObj.push(img_name1);
                            }
                        }

                        detalles[i].galeria = galeriaObj;

                        detalles[i] = items;
                    }
                }
                console.log('Detalle', detalles);
                if (detalles != null) {
                    data.detalles = detalles;
                }
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

const obtener_orden_servicio_img = async function (req, res) {
    var img = req.params['img'];

    fs.stat('./uploads/imagenes/' + img, function (err) {
        console.log(err);
        if (!err) {
            let path_img = './uploads/imagenes/' + img;
            res.status(200).sendFile(path.resolve(path_img));
        }
        else {
            let path_img = './uploads/default.jpg';
            res.status(200).sendFile(path.resolve(path_img));
        }
    })
}

module.exports = {
    registro_orden_servicio,
    listar_orden_servicio,
    eliminar_orden_servicio,
    obtener_orden_servicio,
    actualizar_orden_servicio,
    obtener_orden_servicio_img,
    uploadFileRegisterOrderService
}
