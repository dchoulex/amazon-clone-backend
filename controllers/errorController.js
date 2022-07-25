module.exports = function(err, req, res, next) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    
    if (req.originalUrl.startsWith("/api")) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            error: err,
            stack: err.stack
        })
    }
}