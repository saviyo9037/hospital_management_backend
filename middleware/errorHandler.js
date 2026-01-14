const errorHandler = (err,req,res,next)=>{
    res.status(err.status || 500).json({
        stack:err.stack,
        message:err.message
    })
}

module.exports = errorHandler