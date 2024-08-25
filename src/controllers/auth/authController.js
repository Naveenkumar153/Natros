const User = require('../../models/userModel');
const { catchAsync } = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const JWT = require('../../utils/jwt');

exports.signUp = catchAsync( async (req,res,next) => {
    const newUser = await User.create(req.body);
    const token = JWT.generateToken(newUser);

    res.status(201).json({
        status: 'success',
        token,
        data:{
            user: newUser
        }
    })
});

exports.signIn = catchAsync( async (req,res,next) => {

    const { email, password } = req.body;

    // Check if email and password exits
        if(!email || !password) {
            return next(new AppError('Please provide email and password', 400));
        }   

    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select('+password');
    
    if(!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    };
    // If everything ok, send token to client
    
    const userObj = user.toObject(); // conver mongoose object to javascript object
    delete userObj.password; // delete the password field

    const token = JWT.generateToken(user);
    const data = Object.assign(userObj,{token});
    res.status(200).json({
        status:'success',
        data,
    });

})
