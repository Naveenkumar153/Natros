
let toursModel  = require('../../models/toursModel');


exports.checkParamId = (req,res,next) => {
   
};

exports.getTours = async (req, res) => {

  try {
    const tours = await toursModel.find();

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

exports.createTour = async (req, res) => {

  try {
    const tour = await toursModel.create(req.body)
     res.send(201).json({
      status: 'success',
      data:{
        tour:tour
      }
    });
  } catch (error) {
    await  res.send(400).json({
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
