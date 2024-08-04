const express = require('express');

const tourRouter = express.Router();
const tourController = require('../../controllers/tours/tours.controllers');
const tourValidation = require('../../controllers/tours/tours.validation');

/**
+ * Check if the parameter 'id' exists in the request parameters
+ * @param {id} id - The id of the tour
*/
// tourRouter.param('id', tourController.checkParamId);

tourRouter.route('/')
   .get(tourController.getTours)
   .post(tourController.createTour);

tourRouter.route('/tours-stats').get(tourController.getTourStats);
tourRouter.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

tourRouter.route('/:id')
   .get(tourController.getTourById)
   .patch(tourController.updateTourById)
   .delete(tourController.deleteTourById);

module.exports = tourRouter;