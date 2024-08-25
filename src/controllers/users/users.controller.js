const user = require('../../models/userModel');
const { catchAsync } = require('../../utils//catchAsync');



exports.getAllUsers = catchAsync(async (req, res, next) => {

    const users = await user.find();

    res.status(200).json({
        stauts:'sucess',
        results:users.length,
        data:{ users }
    });
  });
exports.getUser = (req, res) => {
    res.status(500).json({
        stauts:'error',
        message: ' This route is not yet defined! ',
    });
  };
exports.createUser = (req, res) => {
    res.status(500).json({
        stauts:'error',
        message: ' This route is not yet defined! ',
    });
  };
exports.updateUser = (req, res) => {
    res.status(500).json({
        stauts:'error',
        message: ' This route is not yet defined! ',
    });
  };
exports.deleteUser = (req, res) => {
    res.status(500).json({
        stauts:'error',
        message: ' This route is not yet defined! ',
    });
  };