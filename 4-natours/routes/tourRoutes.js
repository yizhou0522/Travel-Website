const express = require('express');
const router = express.Router();
const tourController = require('./../controllers/tourController');

// router.param('id', tourController.checkID);
// if the route has the id, this middleware will response
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
// checkBody is a middleware, after it gets executed, it will switch to createTour
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

//key
// shortcut: press alt and click on the words, then you can edit multple selected things the same time
module.exports = router;
