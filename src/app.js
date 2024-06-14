
const express = require('express');
const app = express();
const morgan = require('morgan');

const tourRouter = require('./routes/tours/tours.router');
const userRouter = require('./routes/users/users.router');

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}else if(process.env.NODE_ENV === 'production'){
    app.use(morgan('tiny'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);



module.exports = app;

