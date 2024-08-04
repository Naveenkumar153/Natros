
let toursModel  = require('../../models/toursModel');
let ApiFeatures = require('../../utils/api-features.class');


exports.checkParamId = (req,res,next) => {
   
};

exports.getTours = async (req, res) => {
  try {

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
    
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }

};

exports.createTour = async (req, res) => {
  try {
    const tour = await toursModel.create(req.body)
     res.status(201).json({
      status: 'success',
      data:{
        tour:tour
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message:error
    });
  }
};

exports.getTourById = async (req, res) => {

  try {
    
    const tours = await toursModel.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tours
      }
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });  
  }

};

exports.getTourStats = async (req,res) => {

  try {
    
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

  } catch (error) {
    console.error('error',error);
  }

};

exports.updateTourById = async (req, res) => {
  try {
    
    const tours = await toursModel.findByIdAndUpdate(req.params.id,req.body, {
      new: true,
      // lean:true
    });
    res.status(200).json({
      status: 'success',
      data: {
        tours
      }
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });  
  }
};

exports.deleteTourById = async (req, res) => {

  try {
    
    const tours = await toursModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tours
      }
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });  
  }
};


exports.getMonthlyPlan = async (req, res) => {

  try {

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


  }catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });  
  }
}