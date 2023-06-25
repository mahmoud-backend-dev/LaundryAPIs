
const express = require('express');
const router = express.Router();

const authMiddleWare = require('../middleware/authMiddleware');
const {
  allowTo
} = require('../controller/authController')

const {
  addBookingSpecial,
  getAllBookingSpecial,
  searchByQueryStringInBookingSpecial
} = require('../controller/specailController')

const {
  addSpecialValidator,
} = require('../utils/validators/specialValidator')


router
  .route('/')
  .get(authMiddleWare, allowTo('admin'),getAllBookingSpecial)
  .post(authMiddleWare, allowTo('user'), addSpecialValidator, addBookingSpecial);


router.get('/search', authMiddleWare, allowTo('admin'), searchByQueryStringInBookingSpecial);

module.exports = router