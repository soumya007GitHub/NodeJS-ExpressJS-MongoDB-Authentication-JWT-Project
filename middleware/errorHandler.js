const errorHandler = (err, req, res, next)=>{
    const statusCode = res.statusCode ? res.statusCode : 500;
    if(statusCode === 400){
        res.status(statusCode).json({title: "All fields are required", message: err.message, stackTrace: err.stack});
    }else{
        res.status(statusCode).json({title: "Resource not found", message: err.message, stackTrace: err.stack});
    }
}

export default errorHandler;