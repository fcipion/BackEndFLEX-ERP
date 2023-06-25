'use strict'

var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');
const puppeteer = require('puppeteer');

var LogController = require('../controllers/generalController');

var Modulo = require('../models/modulo');
var Sucursal = require('../models/sucursal');
var Pagina = require('../models/pagina');
var Usuario = require('../models/usuario');
var Rol = require('../models/rol');
var Rol_Aceeso = require('../models/rol_acceso');
var Companias = require('../models/compania');
var Idioma = require('../models/idioma');
var Estado = require('../models/estado');
var Config_View_Table = require('../models/config_view_table');

//Companias
const registro_compania = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'companias' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].add == true) {
                    var data = req.body;

                    //Imagen
                    var img_path = req.files.logo.path;
                    var name = img_path.split('\\');
                    var img_name = name[2];

                    data.logo = img_name;

                    let reg = await Companias.create(data);

                    //Log
                    LogController.log_create("companias", data, req.user.sub, req.user.compania, reg._id);

                    res.status(200).send({ data: reg });
                }
                else {
                    res.status(500).send({ message: 'NoAccess' });
                }
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

const listar_compania = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'companias' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {

                var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                let reg = await Companias.find();

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
            } else {
                res.status(500).send({ message: 'NoAccess' });
            }
        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({ message: error });
    }
}

const eliminar_compania = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'companias' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].delete == true) {
                var id = req.params['id'];

                //let reg = await Companias.findByIdAndRemove({ _id: id });

                //Log de eliminar
                //LogController.log_delete("companias", req.user.sub, req.user.compania, reg._id);

                res.status(200).send({ data: 'No se puede eliminar la compania' });
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

const obtener_compania = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'companias' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {
                var id = req.params['id'];
                try {
                    var reg = await Companias.findById({ _id: id });

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

const actualizar_compania = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'companias' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].edit == true) {
                let id = req.params['id'];
                var data = req.body;

                if (req.files) {
                    var img_path = req.files.logo.path;
                    var name = img_path.split('\\');
                    var imagen_name = name[2];

                    data.logo = imagen_name;
                    let reg = await Companias.findByIdAndUpdate({ _id: id }, data);

                    fs.stat('./uploads/companias/' + reg.logo, function (err) {
                        if (!err) {
                            fs.unlink('./uploads/companias/' + reg.logo, err => {
                                if (err) throw err;
                            });
                        }
                    })

                    res.status(200).send({ data: reg });
                }
                else {
                    let reg = await Companias.findByIdAndUpdate({ _id: id }, data);
                    res.status(200).send({ data: reg });
                }

                //Log de actualizar
                LogController.log_edit("companias", data, req.user.sub, req.user.compania, reg._id);

                res.status(200).send({ data: data });
            }
            else {
                res.status(500).send({ message: 'NoAccess' });
            }
        } else {
            res.status(500).send({ message: 'NoAccess' });
        }
    } catch (error) {
        res.status(200).send({ message: error });
    }
}

const obtener_compania_img = async function (req, res) {
    var img = req.params['img'];

    fs.stat('./uploads/companias/' + img, function (err) {
        if (!err) {
            let path_img = './uploads/companias/' + img;
            res.status(200).sendFile(path.resolve(path_img));
        }
        else {
            let path_img = './uploads/default.jpg';
            res.status(200).sendFile(path.resolve(path_img));
        }
    })
}

//Sucursales
const registro_sucursal = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'sucursales' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].add == true) {

                var data = req.body;
                data.compania = req.user.compania;
                let reg = await Sucursal.create(data);

                //log de Registro
                LogController.log_create("sucursales", data, req.user.sub, req.user.compania, reg._id);

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

const listar_sucursales = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'sucursales' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {

                var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                let filtro = req.params['filtro'];

                let reg = await Sucursal.find({ compania: req.user.compania, descripcion: new RegExp(filtro, 'i') }).populate('compania');

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

const eliminar_sucursal = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'sucursales' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].delete == true) {
                var id = req.params['id'];

                //let reg = await Sucursal.findByIdAndRemove({ _id: id });

                //Log de eliminar
                //LogController.log_delete("sucursales", req.user.sub, req.user.compania, reg._id);

                res.status(200).send({ data: 'No se puede eliminar la sucursal' });
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

const obtener_sucursal = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'sucursales' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {
                var id = req.params['id'];
                try {
                    var reg = await Sucursal.findById({ _id: id });

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

const actualizar_sucursal = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'sucursales' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].edit == true) {

                let id = req.params['id'];
                var data = req.body;

                let reg = await Sucursal.findByIdAndUpdate({ _id: id }, data);

                //Log de actualizar
                LogController.log_edit("sucursales", data, req.user.sub, req.user.compania, reg._id);

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

//Modulos
const registro_modulo = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'modulos' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].add == true) {
                var data = req.body;

                let reg = await Modulo.create(data);

                //Log
                LogController.log_create("modulos", data, req.user.sub, req.user.compania, reg._id);

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

const listar_modulo = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'modulos' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {

                var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                let filtro = req.params['filtro'];

                let reg = await Modulo.find({ descripcion: new RegExp(filtro, 'i') });

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

const eliminar_modulo = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'modulos' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].delete == true) {
                var id = req.params['id'];

                //let reg = await Modulo.findByIdAndRemove({ _id: id });

                //Eliminar todas las páginas relacionadas
                //await Pagina.remove({ modulo: id });

                //Log de eliminar
                //LogController.log_delete("modulos", req.user.sub, req.user.compania, reg._id);

                res.status(200).send({ data: 'No se puede eliminar la compania' });
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

const obtener_modulo = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'modulos' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {
                var id = req.params['id'];
                try {
                    var reg = await Modulo.findById({ _id: id });

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

const actualizar_modulo = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'modulos' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].edit == true) {
                let id = req.params['id'];
                var data = req.body;

                let reg = await Modulo.findByIdAndUpdate({ _id: id }, data);

                //Log de actualizar
                LogController.log_edit("modulos", data, req.user.sub, req.user.compania, reg._id);

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

//Paginas
const registro_pagina = async function (req, res) {
    try {
      if (req.user) {
        let pagina = await Pagina.findOne({ code: 'paginas' });
        let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
        if (accesos && accesos.acceso[0].add === true) {
          let data = req.body;
          let reg = await Pagina.create(data);
  
          //Log
          LogController.log_create("paginas", data, req.user.sub, req.user.compania, reg._id);
  
          res.status(200).send({ data: reg });
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

const listar_pagina = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'paginas' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {
                let filtro = req.params['filtro'];

                var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                let reg = await Pagina.find({ descripcion: new RegExp(filtro, 'i') }).populate('modulo');

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

const eliminar_pagina = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'paginas' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].delete == true) {
                var id = req.params['id'];

                let reg = await Pagina.findByIdAndRemove({ _id: id });

                //Log de eliminar
                LogController.log_delete("paginas", req.user.sub, req.user.compania, reg._id);

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

const obtener_pagina = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'paginas' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {
                var id = req.params['id'];
                try {
                    var reg = await Pagina.findById({ _id: id });

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

const actualizar_pagina = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'paginas' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].edit == true) {
                let id = req.params['id'];
                var data = req.body;

                let reg = await Pagina.findByIdAndUpdate({ _id: id }, data);

                //Log de actualizar
                LogController.log_edit("paginas", data, req.user.sub, req.user.compania, reg._id);

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

//Usuario
const registro_usuario = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'usuarios' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].add == true) {
                var data = req.body;
                var usuario_arr = [];

                usuario_arr = await Usuario.find({ email: data.email });

                if (usuario_arr.length == 0) {
                    if (data.password) {
                        bcrypt.hash(data.password, null, null, async function (err, hash) {
                            if (hash) {
                                data.password = hash;
                                data.compania = req.user.compania;
                                data.descripcion = data.nombres;
                                var reg = await Usuario.create(data);

                                //Log
                                LogController.log_create("usuarios", data, req.user.sub, req.user.compania, reg._id);

                                res.status(200).send({ data: reg });
                            }
                            else {
                                res.status(200).send({ message: 'Error Server', data: undefined });
                            }
                        })
                    }
                    else {
                        res.status(200).send({ message: 'No existe una contraseña', data: undefined });
                    }
                }
                else {
                    res.status(200).send({ message: 'El correo ya existe en la base de datos', data: undefined });
                }
            }
            else {
                res.status(200).send({ message: 'El usuario debe ser Administrador del sistema', data: undefined });
            }
        } else {
            res.status(200).send({ message: 'Debe autenticarse', data: undefined });
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error });
    }
}

const listar_usuario = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'usuarios' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {

                var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                let reg = await Usuario.find({ compania: req.user.compania }, { password: 0 }).populate('rol').populate('compania');

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

const eliminar_usuario = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'usuarios' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].delete == true) {
                var id = req.params['id'];

                let usuario = await Usuario.findById({ _id: id });

                //Inhabilitar usuario
                usuario.estatus = false;

                let reg = await Usuario.findByIdAndUpdate({ _id: id }, usuario);

                //Log de eliminar
                LogController.log_delete("usuarios", req.user.sub, req.user.compania, reg._id);

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

const obtener_usuario = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'usuarios' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {
                var id = req.params['id'];
                try {
                    var reg = await Usuario.findById({ _id: id }, { password: 0 });

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

const actualizar_usuario = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'usuarios' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].edit == true) {
                let id = req.params['id'];
                var data = req.body;

                if (data.password) {
                    bcrypt.hash(data.password, null, null, async function (err, hash) {
                        if (hash) {
                            data.password = hash;
                        }
                        else {
                            res.status(200).send({ message: 'Error Server', data: undefined });
                        }
                    })
                }
                data.descripcion = data.nombres;
                let reg = await Usuario.findByIdAndUpdate({ _id: id }, data);

                //Log de actualizar
                LogController.log_edit("usuarios", data, req.user.sub, req.user.compania, reg._id);

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

const login_admin = async function (req, res) {
    try {
        var data = req.body;
        var usuario_arr = [];

        usuario_arr = await Usuario.find({ email: data.email });
        console.log(data.email);
        if (usuario_arr.length == 0) {
            res.status(200).send({ code: 1001, message: 'No se encontró el correo', data: undefined });
        }
        else {
            let user = usuario_arr[0];
            if (user.estatus == true) {
                bcrypt.compare(data.password, user.password, async function (error, check) {
                    if (check) {
                        res.status(200).send({
                            data: user,
                            token: jwt.createToken(user)
                        });
                    }
                    else {
                        res.status(200).send({ code: 1002, message: 'La contraseña no coincide', data: undefined });
                    }
                });
            }
            else {
                res.status(200).send({ code: 1003, message: 'Este usuario está inactivo', data: undefined });
            }

        }
    } catch (error) {
        res.status(400).send({ message: error });
    }
};

//Roles
const registro_rol = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'roles' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].add == true) {
                var data = req.body;

                data.compania = req.user.compania;
                let reg = await Rol.create(data);

                //Log
                LogController.log_create("roles", data, req.user.sub, req.user.compania, reg._id);

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

const listar_roles = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'roles' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {

                var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                let reg = await Rol.find({ compania: req.user.compania }).populate('compania');

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

const eliminar_rol = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'roles' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].delete == true) {
                var id = req.params['id'];

                let reg = await Rol.findByIdAndRemove({ _id: id });
                LogController.log_delete("roles", req.user.sub, req.user.compania, reg._id);

                //Eliminar los accesos de ese rol
                //let reg_acceso = await Rol_Aceeso.deleteMany({ rol: id });
                //LogController.log_delete("roles_accesos", req.user.sub, req.user.compania, reg_acceso._id);

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

const obtener_rol = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'roles' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {
                var id = req.params['id'];
                try {
                    var reg = await Rol.findById({ _id: id });

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

const actualizar_rol = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'roles' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].edit == true) {
                let id = req.params['id'];
                var data = req.body;

                let reg = await Rol.findByIdAndUpdate({ _id: id }, data);

                //Log de actualizar
                LogController.log_edit("roles", data, req.user.sub, req.user.compania, reg._id);

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

//Roles Acceso
const registro_rol_acceso = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'roles_accesos' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].add == true) {

                var data = req.body;
                data.compania = req.user.compania;
                let reg = await Rol_Aceeso.create(data);

                //Log
                LogController.log_create("roles_accesos", data, req.user.sub, req.user.compania, reg._id);

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

const listar_roles_acceso = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'roles_accesos' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {

                var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                let reg = await Rol_Aceeso.find({ compania: req.user.compania}).populate('modulo').populate('pagina');

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

const eliminar_rol_acceso = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'roles_accesos' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].delete == true) {
                var id = req.params['id'];

                let reg = await Rol_Aceeso.findByIdAndRemove({ _id: id });

                //Log de eliminar
                LogController.log_delete("roles_accesos", req.user.sub, req.user.compania, reg._id);

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

const obtener_rol_acceso = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'roles_accesos' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].read == true) {
                var id = req.params['id'];
                try {
                    var reg = await Rol_Aceeso.findById({ _id: id });

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

const actualizar_rol_acceso = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'roles_accesos' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos && accesos.acceso[0].edit == true) {
                let id = req.params['id'];
                var data = req.body;

                let reg = await Rol_Aceeso.findByIdAndUpdate({ _id: id }, data);

                //Log de actualizar
                LogController.log_edit("roles_accesos", data, req.user.sub, req.user.compania, reg._id);
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

//Idiomas
const registro_idioma = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'idiomas' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].add == true) {
                    var data = req.body;

                    data.compania = req.user.compania;
                    let reg = await Idioma.create(data);

                    //Log
                    LogController.log_create("idiomas", data, req.user.sub, req.user.compania, reg._id);

                    res.status(200).send({ data: reg });
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
};

const listar_idioma = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'idiomas' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].read == true) {

                    var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                    let filtro = req.params['filtro'];

                    let reg = await Idioma.find({ compania: req.user.compania, descripcion: new RegExp(filtro, 'i') });

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

const eliminar_idioma = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'idiomas' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].delete == true) {
                    var id = req.params['id'];

                    let reg = await Idioma.findByIdAndRemove({ _id: id });

                    //Log de eliminar
                    LogController.log_delete("idiomas", req.user.sub, req.user.compania, reg._id);

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

const obtener_idioma = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'idiomas' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].read == true) {
                    var id = req.params['id'];
                    try {
                        var reg = await Idioma.findById({ _id: id });

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

const actualizar_idioma = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'idiomas' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].edit == true) {
                    let id = req.params['id'];
                    var data = req.body;

                    let reg = await Idioma.findByIdAndUpdate({ _id: id }, data);

                    //Log de actualizar
                    LogController.log_edit("idiomas", data, req.user.sub, req.user.compania, reg._id);
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

//Idiomas
const registro_estado = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'estados' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].add == true) {
                    var data = req.body;

                    data.compania = req.user.compania;
                    let reg = await Estado.create(data);

                    //Log
                    LogController.log_create("estados", data, req.user.sub, req.user.compania, reg._id);

                    res.status(200).send({ data: reg });
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
};

const listar_estados = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'estados' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].read == true) {

                    var config_table = await Config_View_Table.findOne({ compania: req.user.compania, modelo: pagina.code });

                    let filtro = req.params['filtro'];

                    let reg = await Estado.find({ compania: req.user.compania, descripcion: new RegExp(filtro, 'i') });

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

const eliminar_estado = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'estados' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].delete == true) {
                    var id = req.params['id'];

                    let reg = await Estado.findByIdAndRemove({ _id: id });

                    //Log de eliminar
                    LogController.log_delete("estados", req.user.sub, req.user.compania, reg._id);

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

const obtener_estado = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'estados' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].read == true) {
                    var id = req.params['id'];
                    try {
                        var reg = await Estado.findById({ _id: id });

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

const actualizar_estado = async function (req, res) {
    try {
        if (req.user) {
            let pagina = await Pagina.findOne({ code: 'estados' });
            let accesos = await Rol_Aceeso.findOne({ compania: req.user.compania, rol: req.user.role, pagina: pagina._id });
            if (accesos != null) {
                if (accesos.acceso[0].edit == true) {
                    let id = req.params['id'];
                    var data = req.body;

                    let reg = await Estado.findByIdAndUpdate({ _id: id }, data);

                    //Log de actualizar
                    LogController.log_edit("estados", data, req.user.sub, req.user.compania, reg._id);
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

module.exports = {
    //modulos
    registro_modulo,
    listar_modulo,
    eliminar_modulo,
    obtener_modulo,
    actualizar_modulo,

    //Paginas
    registro_pagina,
    listar_pagina,
    eliminar_pagina,
    obtener_pagina,
    actualizar_pagina,

    //Usuarios
    registro_usuario,
    listar_usuario,
    eliminar_usuario,
    obtener_usuario,
    actualizar_usuario,
    login_admin,

    //Roles
    registro_rol,
    listar_roles,
    eliminar_rol,
    obtener_rol,
    actualizar_rol,

    //Role Pagina 
    registro_rol_acceso,
    listar_roles_acceso,
    eliminar_rol_acceso,
    obtener_rol_acceso,
    actualizar_rol_acceso,

    //Companias
    registro_compania,
    listar_compania,
    eliminar_compania,
    obtener_compania,
    actualizar_compania,
    obtener_compania_img,

    //Sucursales
    registro_sucursal,
    listar_sucursales,
    eliminar_sucursal,
    obtener_sucursal,
    actualizar_sucursal,

    //Idiomas
    registro_idioma,
    listar_idioma,
    eliminar_idioma,
    obtener_idioma,
    actualizar_idioma,

    //Estados
    registro_estado,
    listar_estados,
    eliminar_estado,
    obtener_estado,
    actualizar_estado
}