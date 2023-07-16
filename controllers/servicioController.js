'use strict'
require("dotenv/config")
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt');
const { request, response } = require("express")
const { ObjectId } = require('mongodb');
const { promisify } = require('util');
const busboy = require('busboy');

var multiparty = require('connect-multiparty');

var Orden_Servicio = require('../models/orden_servicio');
var SessionOrderService = require('../models/sessionOrderService');

var Pagina = require('../models/pagina');
var Rol_Aceeso = require('../models/rol_acceso');
var Doctor = require('../models/doctor');
var LogController = require('../controllers/generalController');
var Config_View_Table = require('../models/config_view_table');
const { sendMessage } = require("../provider/sendgrid");
const { v4 } = require("uuid")
var bcrypt = require('bcrypt-nodejs');

function generarpassword(long) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';

    for (let i = 0; i < long; i++) {
        const index = Math.floor(Math.random() * characters.length);
        password += characters.charAt(index);
    }

    return password;
}

const sendMessageDoctor = async (doctorId, orderId) => {
    let password = generarpassword(26)


    bcrypt.hash(password, null, null, async function (err, hash) {
        if (err || !hash) return

        let order = await SessionOrderService.create({
            uuid: v4(),
            password: hash,
            ordenServiceId: orderId,
        }).catch((e) => {
            return null
        })

        if (!order) return
        let doctor = await Doctor.findOne({ _id: ObjectId(doctorId) });

        // TMP
        doctor && (doctor.email = "fotewow216@meogl.com")

        if (!doctor || !doctor.email) return


        sendMessage(doctor.email, "Orden de servicio", `
        <!doctype html>
        <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

        <head>
        <title>Orden de servicio</title>
        <!--[if !mso]><!-- -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <!--<![endif]-->
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style type="text/css">
            #outlook a {
            padding: 0;
            }

            body {
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
            }

            table,
            td {
            border-collapse: collapse;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            }

            img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
            -ms-interpolation-mode: bicubic;
            }

            p {
            display: block;
            margin: 13px 0;
            }
        </style>
        <!--[if mso]>
                <xml>
                <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
                </xml>
                <![endif]-->
        <!--[if lte mso 11]>
                <style type="text/css">
                .mj-outlook-group-fix { width:100% !important; }
                </style>
                <![endif]-->
        <!--[if !mso]><!-->
        <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700" rel="stylesheet" type="text/css">
        <style type="text/css">
            @import url(https://fonts.googleapis.com/css?family=Lato:300,400,700);
        </style>
        <!--<![endif]-->
        <style type="text/css">
            @media only screen and (min-width:480px) {
            .mj-column-per-100 {
                width: 100% !important;
                max-width: 100%;
            }
            }
        </style>
        <style type="text/css">
            @media only screen and (max-width:480px) {
            table.mj-full-width-mobile {
                width: 100% !important;
            }

            td.mj-full-width-mobile {
                width: auto !important;
            }
            }
        </style>
        <style type="text/css">
            a,
            span,
            td,
            th {
            -webkit-font-smoothing: antialiased !important;
            -moz-osx-font-smoothing: grayscale !important;
            }
        </style>
        </head>

        <body style="background-color:#ffffff;">
        <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;"> Preview - Welcome to Coded Mails </div>
        <div style="background-color:#ffffff;">
            <!--[if mso | IE]>
            <table
                align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
            >
                <tr>
                <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
            <![endif]-->

            <!--[if mso | IE]>
                </td>
                </tr>
            </table>
            
            <table
                align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
            >
                <tr>
                <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
            <![endif]-->
            <div style="margin:0px auto;max-width:600px;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                <tbody>
                <tr>
                    <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                    <!--[if mso | IE]>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        
                <tr>
            
                    <td
                    class="" style="vertical-align:top;width:600px;"
                    >
                <![endif]-->
                    <div class="mj-column-per-100 mj-outlook-group-fix" style="font-size:0px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="vertical-align:top;" width="100%">
                        <tr>
                            <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                            <div style="font-family:Lato,'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:24px;font-weight:700;line-height:32px;text-align:center;color:#434245;">
                                <h1 style="margin: 0; font-size: 24px; line-height: normal; font-weight: bold;">Welcome, ${doctor.nombre}</h1>
                            </div>
                            </td>
                        </tr>



                        <tr>
                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                            <div style="font-family:Lato,'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:18px;font-weight:400;line-height:24px;text-align:left;color:#434245;">Agradecemos su preferencia por haber elegido a <strong>INTEGRA 3D Imagenes Dentofaciales</strong> como su centro de confianza.</div>
                            </td>
                        </tr>
                        <tr>
                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                            <div style="font-family:Lato,'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:18px;font-weight:400;line-height:24px;text-align:left;color:#434245;">En este correo <strong>adjuntamos las imagenes diagnosticas prescritas</strong>, en caso de cualquier duda o detalle, favor contactarnos por alguna de nuestras vias de comunicacion adscritas en este correo electronico.</div>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" vertical-align="middle" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                            <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                                <tr>
                                <td align="center" bgcolor="#2e58ff" role="presentation" style="border:none;border-radius:3px;cursor:auto;mso-padding-alt:10px 25px;background:#2e58ff;" valign="middle">
                                    <a href="${process.env.FRONTEND_URL}/order/session/${order.uuid}" style="display: inline-block; background: #2e58ff; color: white; font-family: Lato,'Helvetica Neue',Helvetica,Arial,sans-serif; font-size: 14px; font-weight: bold; line-height: 40px; margin: 0; text-decoration: none; text-transform: uppercase; padding: 10px 25px; mso-padding-alt: 0px; border-radius: 3px;" target="_blank"> Click para ver los archivos </a>
                                </td>
                                </tr>
                            </table>
                            </td>
                        </tr>
                        <tr>
                            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                <div style="font-family:Lato,'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:18px;font-weight:400;line-height:24px;text-align:left;color:#434245;">Para poder acceder al archivo utilize esta contraseña:.</div>
                                <div style="font-family:Lato,'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:18px;font-weight:400;line-height:24px;text-align:left;color:#434245;background: #ccc">
                                    ${password}
                                </div>
                            </td>
                        </tr>
                        </table>
                    </div>
                    <!--[if mso | IE]>
                    </td>
                
                </tr>
            
                        </table>
                        <![endif]-->
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
            <!--[if mso | IE]>
                </td>
                </tr>
            </table>
            <![endif]-->
            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#fafafa;background-color:#fafafa;width:100%;">
            <tbody>
                <tr>
                <td>
                    <!--[if mso | IE]>
            <table
                align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
            >
                <tr>
                <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
            <![endif]-->
                    <div style="margin:0px auto;max-width:600px;">
                    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;">
                        <tbody>
                        <tr>
                            <td style="direction:ltr;font-size:0px;padding:20px 0;text-align:center;">
                            <!--[if mso | IE]>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        
                    <tr>
                    <td
                        class="" width="600px"
                    >
                
            <table
                align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
            >
                <tr>
                <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
            <![endif]-->
                            
                            <!--[if mso | IE]>
                </td>
                </tr>
            </table>
            
                    </td>
                    </tr>
                
                        </table>
                        <![endif]-->
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                    <!--[if mso | IE]>
                </td>
                </tr>
            </table>
            <![endif]-->
                </td>
                </tr>
            </tbody>
            </table>
        </div>
        </body>

        </html>
        `)
    })
}

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

        data.detalles = detalles
        let reg = await Orden_Servicio.create(data);

        await Orden_Servicio.updateOne({
            _id: reg._id
        }, {
            detalles: Array.from(detalles || []).map((d) => {
                d.galeria = Array.from(d.galeria || []).map(g => ({
                    ...g,
                    name: g.name.split("----")[1],
                    src: `/obtener_orden_servicio_img/${reg._id}/${g.name}`,
                }))
                return d
            })
        })

        sendMessageDoctor(data.doctor, reg._id)

        LogController.log_create("orden_servicio", data, req.user.sub, req.user.compania, reg._id);

        res.status(200).send({ data: reg });

    } catch (error) {
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
                const regExp = new RegExp(filtro, 'i')

                let reg = await Orden_Servicio.find({ compania: req.user.compania, '$or': [{ descripcion: regExp }, { comentarios: regExp }] }).sort({ createdAt: -1 }).populate("cliente").populate("doctor").populate("vendedor").populate("sucursal");

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
                data.detalles = JSON.parse(data.detalles);

                data.detalles = Array.from(data.detalles || []).map((d) => {
                    d.galeria = Array.from(d.galeria || []).map(g => {
                        if (g.src) return g
                        return {
                            ...g,
                            name: g.name.split("----")[1],
                            src: `/obtener_orden_servicio_img/${id}/${g.name}`,
                        }
                    })
                    return d
                })
                let reg = await Orden_Servicio.findByIdAndUpdate({ _id: id }, data);

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
    const { orderId, img } = req.params
    const _path = './uploads/order-service'
    const pathImg = `${_path}/${orderId}/${img}`

    fs.stat(pathImg, function (err) {
        if (err) {
            return res.status(200).sendFile(path.resolve('./uploads/default.jpg'));
        }

        res.status(200).sendFile(path.resolve(pathImg));
    })
}

const compare = (text1, text2) => {
    return new Promise((resolve) => {
        bcrypt.compare(text1, text2, async function (error, check) {
            resolve(!error && check ? true : false)
        })
    })
}

const hashText = (text) => {
    return new Promise((resolve) => {
        bcrypt.hash(text, null, null, async function (_, hash) {
            resolve(hash)
        })
    })
}

const getOrderVisorFile = async function (req, res) {
    const { password, uuid, token } = req.body

    const session = await SessionOrderService.findOne({ uuid }).catch(() => null)
    if (!session) return res.status(404).json({ error: { message: "Not found", type: "notFound" } })

    let isValid = false
    let __token = ""

    if (token) {
        isValid = await compare(token, session.token)
    } else if (password) {
        isValid = await compare(password, session.password)

        if (isValid) {
            __token = v4()

            let hash = await hashText(__token)

            if (hash) {
                await SessionOrderService.updateOne({
                    _id: session._id
                }, { token: hash }).catch(() => {
                    __token = ""
                })
            } else {
                __token = ""
            }
        }
    }

    if (!isValid) return res.status(500).json({ error: { message: "Invalid password or token", type: "invalidPasswordOrToken" } })

    const order = await Orden_Servicio.findOne({ _id: ObjectId(session.ordenServiceId) }).catch(() => null)
    if (!order) return res.status(404).json({ error: { message: "Not found", type: "notFound" } })

    return res.json({
        order,
        ...(__token ? { token: __token } : {})
    })
}


const getFilePath = (name, fileName, returnDir = false) => {
    try {
        const dir = path.join(__dirname, '../uploads/order-service', name)
        if (returnDir) {
            return dir
        }

        fs.mkdirSync(dir, { recursive: true })

        return path.join(dir, fileName)
    } catch (error) {
        return null
    }
};
const getFileDetails = promisify(fs.stat);

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
const uploadFileRegisterOrderService = async function (req, res) {
    if (!req.user) return res.status(500).send({ message: 'NoAccess' });

    const { orderId, customName } = req.params

    const order = await Orden_Servicio.findOne({ _id: ObjectId(orderId) })
    if (!order) return res.status(500).json({ message: "service order not foud" })

    const contentRange = req.headers['content-range'];
    if (!contentRange) {
        return res.status(400).json({ message: 'Missing "Content-Range" header' });
    }

    const match = contentRange.match(/bytes=(\d+)-(\d+)\/(\d+)/);
    if (!match) {
        return res.status(400).json({ message: 'Invalid "Content-Range" Format' });
    }

    const rangeStart = Number(match[1]);
    const rangeEnd = Number(match[2]);
    const fileSize = Number(match[3]);

    if (rangeStart >= fileSize || rangeStart >= rangeEnd || rangeEnd > fileSize) {
        return res.status(400).json({ message: 'Invalid "Content-Range" provided' });
    }

    const filePath = getFilePath(orderId, customName);
    if (!filePath) return res.sendStatus(500);

    const stream = fs.createWriteStream(filePath, { flags: 'a' })
    const bb = busboy({ headers: req.headers, });

    bb.on('file', (_, file) => {


        getFileDetails(filePath).then((stats) => {
            
            if (stats.size !== rangeStart) {
                stream.end();
                return res.status(400).json({ message: 'Bad "chunk" provided' });
            }



            file.pipe(stream).on('error', (e) => {
                stream.end();
                res.sendStatus(500);
            });
        }).catch(() => {
            stream.end();
            res.status(400).json({ message: 'No file with such credentials' });
        })
    });

    bb.on('error', (e) => {
        stream.end();
        res.sendStatus(500);
    })

    bb.on('finish', () => {
        stream.end();
        res.sendStatus(200);
    });

    bb.on("close", () => {
        console.log("close")
    })

    bb.on("field", () => {
        console.log("field")
    })

    bb.on("fieldsLimit", () => {
        console.log("fieldsLimit")
    })

    bb.on("partsLimit", () => {
        console.log("partsLimit")
    })

    req.pipe(bb);
}

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
const statusFileRegisterOrderService = async function (req, res) {
    const { orderId, customName } = req.params

    getFileDetails(getFilePath(orderId, customName)).then((stats) => {
        res.status(200).json({ totalChunkUploaded: stats.size });
    }).catch(() => {
        res.status(400).json({ message: 'No file with such credentials' });
    })
}


/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
const requestFileRegisterOrderService = async function (req, res) {
    const { orderId, customName } = req.params
    fs.createWriteStream(getFilePath(orderId, customName), { flags: 'w' });
    res.status(200).json({ created: true });
}

const downloadFileRegisterOrderService = async function (req, res) {
    const { orderId, img } = req.params
 
    res.download(path.join(__dirname, '../uploads/order-service', orderId, img), (err) => {
        if (err) {
           return res.sendStatus(500)
        }
    });

}

module.exports = {
    registro_orden_servicio,
    listar_orden_servicio,
    eliminar_orden_servicio,
    obtener_orden_servicio,
    actualizar_orden_servicio,
    obtener_orden_servicio_img,
    uploadFileRegisterOrderService,
    getOrderFileVisor: getOrderVisorFile,
    requestFileRegisterOrderService,
    statusFileRegisterOrderService,
    downloadFileRegisterOrderService
}
