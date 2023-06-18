
const express = require('express');
const router = express.Router();

const authMiddleWare = require('../middleware/authMiddleware');
const {
  allowTo
} = require('../controller/authController')

const {
  addBookingDaily,
  completedBookingDaily,
  deleteBookingDaily,
  getAllBookingDaily
} = require('../controller/dailyController')

const {
  addDailyValidator,
  // getAllBookingValidator,
  deleteDailyValidator
} = require('../utils/validators/dailyValidator')


router
  .route('/')
  .get(authMiddleWare, allowTo('admin'),getAllBookingDaily)
  .post(authMiddleWare, allowTo('user'), addDailyValidator, addBookingDaily);

router
  .route('/:id')
  .patch(authMiddleWare, allowTo('admin'), deleteDailyValidator, completedBookingDaily)
  .delete(authMiddleWare, allowTo('admin'), deleteDailyValidator, deleteBookingDaily);

module.exports = router