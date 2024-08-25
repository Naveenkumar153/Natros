const express = require('express');
const authRouter = express.Router();
const authController = require('../../controllers/auth/authController');

authRouter.post('/signup',authController.signUp);
authRouter.post('/signin',authController.signIn);

module.exports = authRouter;