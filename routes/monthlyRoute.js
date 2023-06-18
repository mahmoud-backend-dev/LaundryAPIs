
const express = require('express');
const router = express.Router();

const authMiddleWare = require('../middleware/authMiddleware');
const {
  allowTo
} = require('../controller/authController')

const {
  addBookingMonthly,
  completedBookingMonthly,
  deleteBookingMonthly,
  getAllBookingMonthly
} = require('../controller/monthlyController')

const {
  addMonthlyValidator,
  deleteMonthlyValidator
} = require('../utils/validators/monthlyValidator')


router
  .route('/')
  .get(authMiddleWare, allowTo('admin'),getAllBookingMonthly)
  .post(authMiddleWare, allowTo('user'), addMonthlyValidator, addBookingMonthly);

router
  .route('/:id')
  .patch(authMiddleWare, allowTo('admin'), deleteMonthlyValidator, completedBookingMonthly)
  .delete(authMiddleWare, allowTo('admin'), deleteMonthlyValidator, deleteBookingMonthly);

module.exports = router