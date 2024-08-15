exports.globalErrorHandler = (err, req, res, next) => {
    
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
   
    if (process.env.NODE_ENV === "development") {

        res.status(err.statusCode).json({
            status: err.status,
            message: err.message || 'Something went wrong. Please try again!',
            stack: err.stack,
            error:err
        });

    } else if (process.env.NODE_ENV === "production") {

        if(err.isOperational){

             // Operational, trusted error: sent message to client
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message || 'Something went wrong. Please try again!',
            });

        }else{
             // Programming or other unknow error: don't want leak error to the client
             
                // 1). Login the error
                console.error('ERROR ', err);

                // 2). Some generic message
                res.status(500).json({
                    status: 'error',
                    message: 'Something went wrong. Please try again!',
                });
        }

    }

};

