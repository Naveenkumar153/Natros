const jwt = require('jsonwebtoken');

class JWT {
    static generateToken(user){
       return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
            // algorithm: 'RS256' 
        });
    }
};

module.exports = JWT;
