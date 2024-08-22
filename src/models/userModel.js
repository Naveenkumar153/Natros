const mongoose = require('mongoose');
const validator = require('validator');

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
});

const User = mongoose.model('User', userSchema);

module.exports =  User;