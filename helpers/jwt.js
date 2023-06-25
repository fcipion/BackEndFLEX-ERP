'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'alexguzman';

exports.createToken = function(user){
    try
    {
    var payload = {
        sub: user._id,
        nombre: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        role: user.rol,
        compania: user.compania,
        iat: moment().unix(),
        exp: moment().add(7,'days').unix()
    }
    return jwt.encode(payload, secret);
    }
    catch(error){
        console.log("es en jwt");
        console.log(error);
    }
}
