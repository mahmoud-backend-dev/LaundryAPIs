
const express = require('express');
const router = express.Router();

const authMiddleWare = require('../middleware/authMiddleware');
const {
  allowTo
} = require('../controller/authController')

const {
  addBookingDaily,
  completedBookingDaily,
  getAllBookingDaily,
  searchByQueryStringInBookingDaily
} = require('../controller/dailyController')

const {
  addDailyValidator,
  getAllBookingValidator,
  deleteDailyValidator
} = require('../utils/validators/dailyValidator')



router
  .route('/')
  .get(authMiddleWare, allowTo('admin'), getAllBookingValidator, getAllBookingDaily)
  .post(authMiddleWare, allowTo('user'), addDailyValidator, addBookingDaily);

router
  .route('/:id')
  .patch(authMiddleWare, allowTo('admin'), deleteDailyValidator, completedBookingDaily)

router.get('/search', authMiddleWare, allowTo('admin'), searchByQueryStringInBookingDaily);
module.exports = router