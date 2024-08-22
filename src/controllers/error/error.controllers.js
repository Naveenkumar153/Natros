
const AppError = require('../../utils/appError');

const handelCaseErrorDB = error => {
    const message = `Invalid ${error.path}: ${error.message}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldDb = err => {
    const message = `Duplicate filed value '${err.keyValue.name}'. Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDb = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};


const handleProductionError = (err,res) => {
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
           res.status(err.statusCode || 500).json({
               status: err.status || 'error',
               message: err.message || 'Something went wrong. Please try again!',
           });
   }
}

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
        
        if(err.name === 'CastError'){
            err = handelCaseErrorDB(err); 
        }else if(err.code === 11000){
            err = handleDuplicateFieldDb(err);
        }

        handleProductionError(err,res);
    }

};

