'use strict'

var express = require('express');
var app = express();
var bodyparse = require('body-parser');
var mongoose = require('mongoose');
var port = process.env.PORT || 4201;
var autoIncrement = require('mongoose-auto-increment');

var administracion_route = require('./routes/administracion');
var gestion_route = require('./routes/gestion');
var representantes_comerciales_route = require('./routes/representante_comercial');
var inventario_route = require('./routes/inventario');
var venta_route = require('./routes/venta');
var general_route = require('./routes/general');
var finanza_route = require('./routes/finanza');
var servicio_route = require('./routes/servicio');

mongoose.connect('mongodb://127.0.0.1:27017/PV',{useUnifiedTopology: true, useNewUrlParser: true}, (err, res)=>
{
    if(err){
        console.log(err);
    }
    else
    {
        console.log('Servidor corriendo exitosamente');
        app.listen(port, function(){
            console.log('Servidor corriendo en el puerto' + port);
        })
    }
});

app.use(bodyparse.urlencoded({extended: true}));
app.use(bodyparse.json({limit: '50mb', extended: true}));

app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*'); 
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
    next();
});

app.use('/api',administracion_route);
app.use('/api',gestion_route);
app.use('/api',representantes_comerciales_route);
app.use('/api',inventario_route);
app.use('/api',venta_route);
app.use('/api',general_route);
app.use('/api',finanza_route);
app.use('/api',servicio_route);

app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(502).send({ message: 'Bad Gateway', error: error.message });
  });
  
module.exports = app;
