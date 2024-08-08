const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tours = new mongoose.Schema({
    name:{ 
        type:String, 
        required:true, 
        unique:true,
        minlength:[10, 'Name must be at least 10 characters'],
        maxlength:[40, 'Name must be less than 40 characters'],
        // validator: [validator.isAlpha, 'Name must only contain characters']
     },
    price:{ type:Number, required:true },
    ratingsAverage: { type: Number, required:true },
    duration: { type: Number, required:true },
    maxGroupSize: { type: Number, required:true },
    difficulty: { 
        type: String, 
        required:true,
        enum:{
            values:['easy', 'medium', 'difficult'],
            message:'Difficulty is either: easy, medium, difficult'
        }
     },
    ratingsQuantity: {
         type:Number,
         default:0,
         min:[1, 'Rating must be above 1.0'],
         max:[5, 'Rating must be below 5.0']
     },
    priceDiscount:Number,
    summary:{ type:String, trim:true, required:true },
    description:{ type:String, trim:true, },
    imageCover:{ type:String, required:true },
    images:[String],
    createdAt:{ type:Date, default:Date.now(), select:false },
    startDates: [Date],
    securetTour:{
        type:Boolean, default:false 
    },
    discountPrice:{
        type:Number,
        validate: {
            validator: function(val) {
                // this only points to current doc on NEW document creation
                return val < this.price;
            },
            message: 'Discount price ({VALUE}) should be below regular price'
        }
    }
},{ 
    toJSON: { virtuals:true, },
    toObject: { virtuals:true, },
 });

tours.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

tours.virtual('roundPrice').get(function() {
    return parseFloat(this.price).toFixed(2);
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tours.pre('save',function(next) {
    console.log('save pre',this);
    console.log(slugify(this.name,{ lower:true }));
    next();
});
tours.pre('save',function(next) {
    console.log('save pre 2',this);
    next();
});

tours.post('save',function(doc,next) {
    next();
});

// QUERY middelware: runs before .find() and .findOne()
tours.pre(/^find/,function(next) {
    this.find({ securetTour: { $ne: true } });
    this.startDates = Date.now();
    next();
});

tours.post(/^find/,function(docs,next) {
    console.log(`Query took ${Date.now() - this.startDates } milliseconds`);
    next();
});


// AGGREGATION middelware
tours.pre('aggregate',function(next) {
    this.pipeline().unshift({ $match:{ securetTour: { $ne: true } } });
    next();
});

module.exports =  mongoose.model('Tours', tours);