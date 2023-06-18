
const express = require('express');
const router = express.Router();

const authMiddleWare = require('../middleware/authMiddleware');
const {
  allowTo
} = require('../controller/authController')

const {
  addBookingSpecial,
  completedBookingSpecial,
  deleteBookingSpecial,
  getAllBookingSpecial
} = require('../controller/specailController')

const {
  addSpecialValidator,
  deleteSpecialValidator
} = require('../utils/validators/specialValidator')


router
  .route('/')
  .get(authMiddleWare, allowTo('admin'),getAllBookingSpecial)
  .post(authMiddleWare, allowTo('user'), addSpecialValidator, addBookingSpecial);

router
  .route('/:id')
  .patch(authMiddleWare, allowTo('admin'), deleteSpecialValidator, completedBookingSpecial)
  .delete(authMiddleWare, allowTo('admin'), deleteSpecialValidator, deleteBookingSpecial);

module.exports = router