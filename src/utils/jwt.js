const jwt = require('jsonwebtoken');

class JWT {
    static generateToken(user){
       return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
            // algorithm: 'RS256' 
        });
    };

    static verifyToken(token){
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if(err) return reject(err);
                else if(!decoded) rejects('User is not verifyed');
                resolve(decoded);
            })
        });
    }
};

module.exports = JWT;
