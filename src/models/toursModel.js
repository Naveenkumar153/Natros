const mongoose = require('mongoose');

const tours = new mongoose.Schema({
    name:{ type:String, required:true, unique:true },
    price:{ type:Number, required:true },
    rating: { type: Number, required:true },
});

module.exports =  mongoose.model('Tours', tours);