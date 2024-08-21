const db = require('../database/db');

function sanitizeRequestBody(reqBody){
    if (!reqBody) return null;
    return typeof reqBody === 'string' ? reqBody : JSON.stringify(reqBody);
}

const logRequest = async(req,res,next) =>{
    const startTime = Date.now();
    console.log(req.query)

    res.on('finish', async()=>{
        const duration = Date.now() - startTime;
        const logEntry = {
            method: req.method,
            url: req.originalUrl,
            status_code: res.statusCode,
            request_time: new Date(),
            message: res.statusCode >= 400 ? res.statusMessage : `Request completed in ${duration}ms`,
            body: sanitizeRequestBody(req.body),
    }
try{
    await db('api_logs').insert(logEntry);
    }
catch(err){
    console.error('Failed to log request:', error);
    };
    });
    next();
};

module.exports = logRequest;