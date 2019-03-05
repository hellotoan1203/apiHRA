let jwt = require('jsonwebtoken');
const config = require('../config');

let checkToken = (req, res, next) =>{
    let token = req.headers['x-access-token'] || req.headers['authorization']; 
    if(token){
        if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
        jwt.verify(token, config.secret, (err,decode)=>{
            if(err){
                return res.json({
                    success: false,
                    message: 'Token is not valid'
                });
                
            } else{
                req.decode = decode;
                next();
            }
        })
    }
    }else{
        return res.json({
            success: false,
            message: 'Token is not exist'
        })
    }
}

module.exports.checkToken = checkToken;