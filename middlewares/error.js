const errorHandler = (err, req, res, next)=>{
    return res.status(err.statusCode || 500).json({
        status: 'Failed',
        message: err.message || 'Internal server error'
    })
}

module.exports = errorHandler;