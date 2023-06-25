
const express = require('express');
const router = express.Router();

const authMiddleWare = require('../middleware/authMiddleware');
const {
  allowTo
} = require('../controller/authController')

const {
  addBookingMonthly,
  getAllBookingMonthly,
  searchByQueryStringInBookingMonthly,
} = require('../controller/monthlyController')

const {
  addMonthlyValidator,
} = require('../utils/validators/monthlyValidator')


router
  .route('/')
  .get(authMiddleWare, allowTo('admin'),getAllBookingMonthly)
  .post(authMiddleWare, allowTo('user'), addMonthlyValidator, addBookingMonthly);



router.get('/search', authMiddleWare, allowTo('admin'), searchByQueryStringInBookingMonthly);

module.exports = router