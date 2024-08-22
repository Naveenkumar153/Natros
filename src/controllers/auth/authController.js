const User = require('../../models/userModel');
const { catchAsync } = require('../../utils/catchAsync');

exports.signup = catchAsync( async (req,res,next) => {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({
        status: 'success',
        data:{
            user: newUser
        }
    })
});
