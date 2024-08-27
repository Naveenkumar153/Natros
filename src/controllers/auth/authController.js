const User = require('../../models/userModel');
const { catchAsync } = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const JWT = require('../../utils/jwt');

exports.signUp = catchAsync( async (req,res,next) => {
    const newUser = await User.create(req.body);
    const token = JWT.generateToken(newUser);

    const userObj = newUser.toObject(); // conver mongoose object to javascript object
    delete userObj.password; // delete the password field

    const data = Object.assign(userObj,{token});

    res.status(201).json({
        status: 'success',
        token,
        data:{
            user: data
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
        data:{
            user: data
        },
    });

});

exports.protect = catchAsync(async function(req,res,next){
    // Getting token and check of it's share
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    };
    if(!token) {
        return next(new AppError('You are not logged in! Please log in to get access', 401));
    }
    // Verification token

    const decoded = JWT.verifyToken(token)
    .then(async decoded => {
        // Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if(!currentUser) {
            return next(new AppError('The user belonging to this token does no longer exist', 401));
        };

        // Check if user changed password after the token was issues
        if(currentUser.changedPasswordAfter(decoded.iat)) {
            return next(new AppError('User recently changed password! Please log in again.', 401));
        };

        // Grand access to protected route
        req.user = currentUser;
        next();
    })
    .catch(err => (
        next(new AppError('Session expired', 401))
    ));
});

exports.restrictTo = (function(...roles) {
    return (req,res,next) => {
        console.log('req.user',req.user);
        console.log('roles',roles);
        if(!roles.includes(req.user.role)) {
            return next(new AppError('You are not have permission to perform this action', 403));
        }
        next();
    }
});
