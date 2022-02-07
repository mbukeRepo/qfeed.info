module.exports = (err, req,res,next) => {
    if (err.code == 11000){
        let value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
        let message = `Duplicate field value: ${value} please use another value !`;
        return res.status(400).json({
            status: "failed",
            message
        })
    }
    // handling jwt error 
    if(err.name === "JsonWebTokenError"){
	console.log(err);
        return res.status(400).json({
            status:"failed",
            message:"your token has been tampered with"
        });
    }
    if(err.name === "TokenExpiredError"){
        return res.status(401).json({
            status:"failed",
            message:"token has expired"
        })
    }
    if (err.statusCode == 400){
        res.status(400).json({
            status:"failed",
            message: "syntax error"
        })
    }
    if (err.code === 'LIMIT_FILE_SIZE') 
    {
        return res.status(400).json({
            status:"failed",
            message:"file size must be 5mbs at maximum"
        })
    }
    if(err.name === 'CastError') {
        return res.status(404).json({
            status:"failed",
            message:"object not found"
        })
    }

    console.log(err);
    res.status(500).json({
        status:"error",
        message: "internal server error"
    })

}

