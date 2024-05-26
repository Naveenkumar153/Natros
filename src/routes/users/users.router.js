const express = require('express');
const userRouter = express.Router();
const userController = require('../../controllers/users/users.controller');


userRouter.route('/')
   .get(userController.getAllUsers)
   .post(userController.createUser)

userRouter.route('/:id')
   .get(userController.getUser)
   .patch(userController.updateUser)
   .delete(userController.deleteUser);


module.exports = userRouter;