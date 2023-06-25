'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'alexguzman';

exports.auth = function(req, res, next){
    if(!req.headers.authorization)
    {
        console.log("No debio entrar");
        return res.status(403).send({message: 'NoHeadersError'});
    }

    var token = req.headers.authorization.replace('Bearer ','');
    var token = token.replace(/['"]+/g,'');
    var segment = token.split('.');

    if(segment.length != 3){
        return res.status(403).send({message: 'InvalidToken'});
    }
    else 
    {
        try{
            
            var payload = jwt.decode(token.trim(), secret);
            
            if(payload.exp <= moment().unix()){
                return res.status(403).send({message: 'TokenExpirado'});
            }
        }
        catch(error){
            console.log(error);
            return res.status(403).send({message: 'InvalidToken'});
        }
    }

    req.user = payload;

    next();
}