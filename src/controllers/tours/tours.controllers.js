
let toursModel  = require('../../models/toursModel');
let ApiFeatures = require('../../utils/api-features.class');
let { catchAsync } = require('../../utils/catchAsync');
let AppError = require('../../utils/appError');

exports.checkParamId = (req,res,next) => {
   
};

exports.getTours = catchAsync(async (req, res,next) => {

    const features = new ApiFeatures(toursModel.find(), req.query)
    .filter()
    .sort()
    .rateLimit()
    .pagination();

    const tours = await features.query;
    console.log('features',tours);

    res.status(200).json({
      status: 'success',
      result:tours.length,
      data: {
        tours
      }
    });

});

exports.createTour = catchAsync(async (req, res,next) => {
    const tour = await toursModel.create(req.body)
    res.status(201).json({
      status: 'success',
      data:{
        tour:tour
      }
    });  
});

exports.getTourById = catchAsync(async (req, res,next) => {

    const tours = await toursModel.findById(req.params.id);
    console.log('tours',tours);
    if(!tours){
        next(new AppError('No tour found with that ID',404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        tours
      }
    });
 
});

exports.getTourStats = catchAsync(async (req,res,next) => {

    const stats = await toursModel.aggregate([
       {
         $match: { ratingsAverage: { $gte: 4.5 } }
       },
       {
         $group:{
           _id:'$difficulty',
          //  _id:'null',
           numTours: { $sum:1 },
           numRatings: { $sum:'$ratingsQuantity' },
           avgRating: { $avg:'$ratingsAverage' },
           avgPrice: { $avg:'$price' },
           minPrice: { $min: '$price' },
           maxPrice: { $max: '$price' }
         }
       },
      {
        $sort: { avgPrice: 1 },
      },
      // {
      //   $match: { _id: { $ne: 'medium' } }
      // }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });

});

exports.updateTourById = catchAsync(async (req, res,next) => {
    
    const tours = await toursModel.findByIdAndUpdate(req.params.id,req.body, {
      new: true,
      // lean:true
    });

    if(!tours){
      return next(new AppError('No tour found with that ID',404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        tours
      }
    });

});

exports.deleteTourById = catchAsync(async (req, res,next) => {

    const tours = await toursModel.findByIdAndDelete(req.params.id);

    if(!tours){
      return next(new AppError('No tour found with that ID',404));
    };

    res.status(200).json({
      status: 'success',
      data: null
    });

});


exports.getMonthlyPlan = catchAsync(async (req, res,next) => {

    const year = +req.params.year;
    console.log('year',year);

    const plan = await toursModel.aggregate([
      {
        // $unwind: true,
        $unwind: '$startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group:{
          _id:{ $month: '$startDates' },
          numTourStarts: { $sum:1 },
          toursName: { $push: '$name' }
        }
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project:{ _id:0 }
      },
      {
        $sort:{ numTourStarts:-1 }
      },
      {
        $limit:5
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        length: plan.length,
        plan
      }
    });


});