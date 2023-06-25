
const express = require('express');
const router = express.Router();

const authMiddleWare = require('../middleware/authMiddleware');
const {
  allowTo
} = require('../controller/authController')

const {
  addBookingYearly,
  getAllBookingYearly,
  searchByQueryStringInBookingYearly
} = require('../controller/yearlyController')

const {
  addYearlyValidator,
} = require('../utils/validators/yearlyValidator')


router
  .route('/')
  .get(authMiddleWare, allowTo('admin'),getAllBookingYearly)
  .post(authMiddleWare, allowTo('user'), addYearlyValidator, addBookingYearly);


router.get('/search', authMiddleWare, allowTo('admin'), searchByQueryStringInBookingYearly);
module.exports = router