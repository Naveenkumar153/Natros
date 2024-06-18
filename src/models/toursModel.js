const mongoose = require('mongoose');

const tours = new mongoose.Schema({
    name:{ type:String, required:true, unique:true },
    price:{ type:Number, required:true },
    ratingsAverage: { type: Number, required:true },
    duration: { type: Number, required:true },
    maxGroupSize: { type: Number, required:true },
    difficulty: { type: String, required:true },
    ratingsQuantity: { type:Number, default:0 },
    priceDiscount:Number,
    summary:{ type:String, trim:true, required:true },
    description:{ type:String, trim:true, },
    imageCover:{ type:String, required:true },
    images:[String],
    createdAt:{ type:Date, default:Date.now() },
    startDates: [Date]
});

module.exports =  mongoose.model('Tours', tours);