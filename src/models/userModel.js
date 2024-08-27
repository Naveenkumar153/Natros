const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { 
        type: String, 
        required: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: { 
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters'],
        select: false
    },
    profilePhoto: String,
    confirmPassword: { 
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function(val) {
                return val === this.password;
            },
            message: 'Passwords do not match'
        }
    },
    passwordChangedAt: Date,
    role:{
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    }
});

userSchema.pre('save',  (async function(next) {
    // Only runs when password was actually modified

    if(!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    // delete the confirmPassword field
    this.confirmPassword = undefined;
    next();
}));

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        console.log('this.passwordChangedAt',this.passwordChangedAt);
        console.log('JWTTimestamp',JWTTimestamp);
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    // false means not changed
    return false;
};

const User = mongoose.model('User', userSchema);

module.exports =  User;