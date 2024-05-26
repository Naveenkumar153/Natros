const fs = require('fs').promises;

let tours;
(async () => {
  // const filePath = `${__dirname}./dev-data/data/tours-simple.json`;
  const filePath = './dev-data/data/tours-simple.json';
  tours = JSON.parse(await fs.readFile(filePath, 'utf-8'));
})();

exports.checkParamId = (req,res,next) => {
  const tourId = +req.params.id;
  if (isNaN(tourId) || tourId > tours.length) {
    res.status(400).json({
      status: 'fail',
      data: { message: 'Invalid tour id' },
    });
  } else {
    next();
  }
};




exports.getTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tours,
    },
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };
  tours.push(newTour);
  const filePath = './dev-data/data/tours-simple.json';

  fs.writeFile(filePath, JSON.stringify(tours), (err) => {
    if (err) {
      console.error(`Error: ${err.message}`);
      res.status(500).json({
        status: 'fail',
        data: { message: 'Failed to create tour' },
      });
    } else {
      res.status(201).json({
        status: 'success',
        data: { tour: newTour },
      });
    }
  });
};

exports.getTourById = (req, res) => {
  const tourId = +req.params.id;
  const tour = tours.find((tour) => tour.id === tourId);
  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

exports.updateTourById = (req, res) => {
  const tourId = +req.params.id;
  const tour = tours.find((tour) => tour.id === tourId);
  if (tour) {
    Object.assign(tour, req.body);
    res.status(200).json({
      status: 'success',
      data: { message: 'Tour updated' },
    });
  } 
};

exports.deleteTourById = (req, res) => {
  const tour = tours.findIndex((tour) => tour.id === +req.params.id);
  if (tour !== -1) {
    // tours.splice(tour, 1);
    // fs.writeFile(filePath, JSON.stringify(tours), (err) => {
      // if (err) {
        // console.error(`Error: ${err.message}`);
        // res.status(500).json({
        //   status: 'fail',
        //   data: { message: 'Failed to delete tour' },
        // });
      // } else {
        res.status(200).json({
          status: 'success',
          data: { message: 'Tour deleted' },
        });
      // }
    // });
  } 
};
