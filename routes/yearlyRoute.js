
const express = require('express');
const router = express.Router();

const authMiddleWare = require('../middleware/authMiddleware');
const {
  allowTo
} = require('../controller/authController')

const {
  addBookingYearly,
  completedBookingYearly,
  deleteBookingYearly,
  getAllBookingYearly
} = require('../controller/yearlyController')

const {
  addYearlyValidator,
  deleteYearlyValidator
} = require('../utils/validators/yearlyValidator')


router
  .route('/')
  .get(authMiddleWare, allowTo('admin'),getAllBookingYearly)
  .post(authMiddleWare, allowTo('user'), addYearlyValidator, addBookingYearly);

router
  .route('/:id')
  .patch(authMiddleWare, allowTo('admin'), deleteYearlyValidator, completedBookingYearly)
  .delete(authMiddleWare, allowTo('admin'), deleteYearlyValidator, deleteBookingYearly);

module.exports = router