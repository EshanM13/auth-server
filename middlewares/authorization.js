const jwt = require('jsonwebtoken');
const config = require('../config/config.json');
const CustomError = require('../errors/Errors');

const isAuthorized = async(req,res,next)=> {
    try{
        const authHeader = req.headers.authorization
        if(!authHeader){
            throw new CustomError('Authorization header missing', 401);
        }
        const headerToken = authHeader.split(' ');
        await validateToken(headerToken, req);
        next();
    }
    catch(err){
        return res.status(err.statusCode || 500).json({
            status: 'Failed',
            message: err.message || 'Internal Server Error'    
        })
    }
}

async function validateToken(headerToken, req){
    if (headerToken[0] !== 'Bearer' || !headerToken[1]) {
        throw new CustomError('Invalid token format', 401);
    }
    const token = headerToken[1];
    await decodeToken(token, req);
}

async function decodeToken(token, req) {
    try{
        const decodedUser = await jwt.verify(token, config.SECRET_TOKEN_KEY);
        req.user = decodedUser;
    }
    catch(err){
        throw new CustomError('Invalid or expired token', 401);
    }
}

module.exports = isAuthorized;
