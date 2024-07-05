
let toursModel  = require('../../models/toursModel');


exports.checkParamId = (req,res,next) => {
   
};

exports.getTours = async (req, res) => {
  try {

    // BUILD QUERY
    let queryObj = { ...req.query };
    const excludedFields = ['page','sort','limit','fields'];
    excludedFields.forEach(field => delete queryObj[field]);
    
    // ADVANCED FILTERING
    
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    let query = toursModel.find(JSON.parse(queryStr));

    // SORTING
    if(req.query.sort){
      query = query.sort(req.query.sort)
    }else{
      query = query.sort('-createdAt');
    }

    
    // RATE LIMITING

    if(req.query.fields){
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    }else{
      query = query.select('-__v');
    };


    // PAGINATION
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    if(req.query.page){
      const numToursQuery = toursModel.countDocuments(JSON.parse(queryStr));
      const numTours = await numToursQuery;
      if(skip >= numTours){
        throw new Error('This page does not exist!');
      }
    };
    
    // Execute query
    const tours = await query;

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
