'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');

var Pagina = require('../models/pagina');
var Rol_Aceeso = require('../models/rol_acceso');

var Cuenta_Contable = require('../models/cuenta_contables');

var LogController = require('../controllers/generalController');
var Config_View_Table = require('../models/config_view_table');

//Cuentas contables
const registro_cuenta_contable = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'cuenta_contable'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
                if(accesos.acceso[0].add == true){
                    var data = req.body;

                    data.compania = req.user.compania;
                    let exit = await Cuenta_Contable.find({compania: req.user.compania, cuenta: data.cuenta}).populate('sucursal');

                    if (exit.length>0) {
                        res.status(400).send({message: 'Ya existe una cuenta contable con esta cuenta'});
                    }
                    else{
                        let reg = await Cuenta_Contable.create(data);

                        //log de Registro
                        LogController.log_create("cuenta_contable", data, req.user.sub, req.user.compania, reg._id);
    
                        res.status(200).send({data:reg});
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
        console.log(error);
        res.status(400).send({message: error});
    }
}

const listar_cuenta_contable = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'cuenta_contable'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
                if(accesos.acceso[0].read == true){

                    var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                    let filtro = req.params['filtro'];

                    let reg = await Cuenta_Contable.find({compania: req.user.compania, descripcion: new RegExp(filtro, 'i')}).populate('sucursal');

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

const eliminar_cuenta_contable = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'cuenta_contable'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
                if(accesos.acceso[0].delete == true){
                    var id = req.params['id'];
                    let reg = await Cuenta_Contable.findByIdAndRemove({_id:id});

                    //Log de eliminar
                    LogController.log_delete("cuenta_contable", req.user.sub, req.user.compania, reg._id);

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

const obtener_cuenta_contable = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'cuenta_contable'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
            if(accesos.acceso[0].read == true){
                var id = req.params['id'];
                try {
                    var reg = await Cuenta_Contable.findById({_id:id}).populate("cuenta_contable");

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

const actualizar_cuenta_contable = async function(req, res){
    try {
        if(req.user){
            let pagina = await Pagina.findOne({code: 'cuenta_contable'});
            let accesos = await Rol_Aceeso.findOne({compania: req.user.compania, rol:req.user.role, pagina: pagina._id});
            if(accesos != null)
            {
                if(accesos.acceso[0].edit == true){
                    let id = req.params['id'];
                    var data = req.body;

                    let reg = await Cuenta_Contable.findByIdAndUpdate({_id:id},data);

                    //Log de actualizar
                    LogController.log_edit("cuenta_contable", data, req.user.sub, req.user.compania, reg._id);

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

module.exports = {
    registro_cuenta_contable,
    listar_cuenta_contable,
    eliminar_cuenta_contable,
    obtener_cuenta_contable,
    actualizar_cuenta_contable
}    