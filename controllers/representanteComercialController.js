'use strict'

const xlsx = require('xlsx');
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');

var Pagina = require('../models/pagina');
var Rol_Aceeso = require('../models/rol_acceso');

var Cliente = require('../models/cliente');
var Proveedor = require('../models/proveedor');
var Doctor = require('../models/doctor');

var Tickets = require('../models/ticket');
var Venta = require('../models/venta');

var LogController = require('../controllers/generalController');
var Config_View_Table = require('../models/config_view_table');
//Clientes
const registro_cliente = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'clientes'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
                if(accesos.acceso[0].add == true){
                    var data = req.body;

                    data.descripcion = data.nombre;
                    data.compania = req.user.compania;
                    let reg = await Cliente.create(data);

                    //log de Registro
                    LogController.log_create("clientes", data, req.user.sub, req.user.compania, reg._id);

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

const listar_cliente = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'clientes'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
                if(accesos.acceso[0].read == true){

                    var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                    let filtro = req.params['filtro'];

                    let reg = await Cliente.find({compania: req.user.compania, descripcion: new RegExp(filtro, 'i')}).populate("tipo_cliente").populate("tipo_documento").populate("termino_pago").populate("vendedor").populate("moneda_curso");

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

const eliminar_cliente = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'clientes'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
            if(accesos.acceso[0].delete == true){
                var id = req.params['id'];

                var tickets_arr = [];
                var ventas_arr = [];

                //Tickets
                tickets_arr = await Tickets.find({ cliente: id });
                if (tickets_arr.length == 0) {

                    //Ventas
                    ventas_arr = await Venta.find({ cliente: id });
                    if (ventas_arr.length == 0) {
                        let reg = await Cliente.findByIdAndRemove({_id:id});

                        //Log de eliminar
                        LogController.log_delete("clientes", req.user.sub, req.user.compania, reg._id);

                        res.status(200).send({data:reg});
                    }
                    else {
                        res.status(200).send({ code: 1004, message: 'No se puede eliminar este cliente, existen (' + ventas_arr.length + ') ventas con este cliente', data: undefined });
                    }
                }
                else {
                    res.status(200).send({ code: 1004, message: 'No se puede eliminar este cliente, existen (' + tickets_arr.length + ') tickets con este cliente', data: undefined });
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

const obtener_cliente = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'clientes'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
            if(accesos.acceso[0].read == true){
                var id = req.params['id'];
                try {
                    var reg = await Cliente.findById({_id:id}).populate("tipo_cliente").populate("tipo_documento").populate("termino_pago").populate("vendedor").populate("moneda_curso");;

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

const actualizar_cliente = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'clientes'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
            if(accesos.acceso[0].edit == true){
                let id = req.params['id'];
                var data = req.body;

                data.descripcion = data.nombre;
                let reg = await Cliente.findByIdAndUpdate({_id:id},data);

                //Log de actualizar
                LogController.log_edit("clientes", data, req.user.sub, req.user.compania, reg._id);

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

//Doctor
const registro_doctor = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'doctor'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
                if(accesos.acceso[0].add == true){
                    var data = req.body;
                    
                    data.compania = req.user.compania;
                    let reg = await Doctor.create(data);

                    //log de Registro
                    LogController.log_create("doctor", data, req.user.sub, req.user.compania, reg._id);

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

const listar_doctor = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'doctor'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
            if(accesos.acceso[0].read == true){
                var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                let filtro = req.params['filtro'];

                let reg = await Doctor.find({ 
                    compania: req.user.compania, 
                    $or: [
                            {descripcion: new RegExp(filtro, 'i')}, 
                            {nombre: new RegExp(filtro, 'i')}
                        ]
                    }).populate("tipo_documento");
                    
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

const eliminar_doctor = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'doctor'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
            if(accesos.acceso[0].delete == true){
                var id = req.params['id'];

                var ventas_arr = [];

                ventas_arr = await Venta.find({ doctor: id });
    
                    if (ventas_arr.length == 0) {
                        let reg = await Doctor.findByIdAndRemove({_id:id});

                        //Log de eliminar
                        LogController.log_delete("doctor", req.user.sub, req.user.compania, reg._id);

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

const obtener_doctor = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'doctor'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
            if(accesos.acceso[0].read == true){
                var id = req.params['id'];
                try {
                    var reg = await Doctor.findById({_id:id}).populate("tipo_documento");

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

const actualizar_doctor = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'doctor'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
            if(accesos.acceso[0].edit == true){
                let id = req.params['id'];
                var data = req.body;

                data.descripcion = data.nombre;
                let reg = await Doctor.findByIdAndUpdate({_id:id},data);

                //Log de actualizar
                LogController.log_edit("doctor", data, req.user.sub, req.user.compania, reg._id);
                
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

//Proveedores
const registro_proveedor = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'proveedores'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
            if(accesos.acceso[0].add == true){
                var data = req.body;
                
                data.descripcion = data.nombre;
                data.compania = req.user.compania;
                let reg = await Proveedor.create(data);

                //log de Registro
                LogController.log_create("proveedores", data, req.user.sub, req.user.compania, reg._id);

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

const listar_proveedor = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'proveedores'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
            if(accesos.acceso[0].read == true){
                var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                let filtro = req.params['filtro'];

                let reg = await Proveedor.find({compania: req.user.compania, descripcion: new RegExp(filtro, 'i')}).populate("tipo_cliente").populate("tipo_documento").populate("termino_pago");
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
        res.status(400).send({message: error});
    }
}

const eliminar_proveedor = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'proveedores'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
            if(accesos.acceso[0].delete == true){
                var id = req.params['id'];

                let reg = await Proveedor.findByIdAndRemove({_id:id});

                //Log de eliminar
                LogController.log_delete("proveedores", req.user.sub, req.user.compania, reg._id);

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

const obtener_proveedor = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'proveedores'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
            if(accesos.acceso[0].read == true){
                var id = req.params['id'];
                try {
                    var reg = await Proveedor.findById({_id:id}).populate("tipo_cliente").populate("tipo_documento").populate("termino_pago");

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

const actualizar_proveedor = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'proveedores'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
            if(accesos.acceso[0].edit == true){
                let id = req.params['id'];
                var data = req.body;
                data.descripcion = data.nombre;

                let reg = await Proveedor.findByIdAndUpdate({_id:id},data);

                //Log de actualizar
                LogController.log_edit("proveedores", data, req.user.sub, req.user.compania, reg._id);

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

const subir_plantilla_doctor = async function(req, res) {
      try {
        if (req.user) {
          let pagina = await Pagina.findOne({ code: 'doctor' });
          let accesos = await Rol_Aceeso.findOne({
            compania: req.user.compania,
            rol: req.user.role,
            pagina: pagina._id,
          });
          if (accesos != null) {
            if (accesos.acceso[0].add == true) {
                if (!req.files || !req.files.file) {
                    res.status(400).send('No se ha enviado ningún archivo');
                    return;
                  }
                
                  const workbook = xlsx.readFile(req.files.file.path);
                  const sheetName = workbook.SheetNames[0];
                  const sheet = workbook.Sheets[sheetName];
                  const data = xlsx.utils.sheet_to_json(sheet);
                  let doctors = data.map(doc => ({
                    ...doc, // Copia todos los campos del objeto 'doc' al nuevo objeto 'doctor'
                    compania: req.user.compania,
                    nombre: doc.Nombre || '', // Utiliza el valor predeterminado si 'doc.Nombre' no está definido
                    descripcion: doc.Nombre || '',
                    tipo_documento: doc.tipo_documento || null,
                    documento: doc.documento || '',
                    pagina_web: doc.pagina_web || '',
                    email: doc.Email || '',
                    telefono: doc.Telefono || '',
                    telefono1: doc.telefono1 || '',
                    fax: doc.fax || '',
                    estatus: true,
                  }));
                  
                  let insertedDoctors = [];
                  let failedInserts = 0;
                  
                  for (let doctor of doctors) {
                    try {
                      let insertedDoctor = await Doctor.create(doctor);
                      insertedDoctors.push(insertedDoctor);
                    } catch (error) {
                      console.error('Error al insertar documento en MongoDB:', error);
                      failedInserts++;
                    }
                  }
                  
                  res.status(200).send(`Se han insertado ${insertedDoctors.length} registros en MongoDB. ${failedInserts} registros fallidos.`);
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
        console.log(error);
        res.status(400).send({ message: error });
      }
    }

module.exports = {
registro_cliente,
listar_cliente,
eliminar_cliente,
obtener_cliente,
actualizar_cliente,

registro_proveedor,
listar_proveedor,
eliminar_proveedor,
obtener_proveedor,
actualizar_proveedor,

registro_doctor,
listar_doctor,
eliminar_doctor,
obtener_doctor,
actualizar_doctor,
subir_plantilla_doctor
}