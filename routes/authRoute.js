
const express = require('express');
const router = express.Router();

const authMiddleWare = require('../middleware/authMiddleware');

const {
  signup,
  varifyResetCodeForSignup,
  login,
  varifyResetCodeForPassword,
  forgetPassword,
  resetPassword,
  resendRestCodeForSignup,
  resendRestCodeForPassword,
  changePassword,
  allowTo,
  getAllUsers,
  deleteSpecificUser,
  getAllBookingOrder,
  deleteUserData,
  contactUs
} = require('../controller/authController')
const {
  signupValidator,
  varifyCodeValidator,
  loginValidator,
  forgetPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator,
  deleteSpecificUserValidator,
  contactUsValidator
} = require('../utils/validators/authValidator')


router.post('/signup', signupValidator, signup);


router.post('/login', loginValidator, login);


router.post('/resetPassword',resetPasswordValidator,resetPassword)

router.post('/changePassword', changePasswordValidator, changePassword);

router.get('/users', authMiddleWare, allowTo('admin'), getAllUsers);
router.delete('/users/:id', authMiddleWare, allowTo('admin'), deleteSpecificUserValidator, deleteSpecificUser);
router.delete('/deleteMe', authMiddleWare, allowTo('user'),deleteUserData);

router.get('/users/bookingOrder', authMiddleWare, allowTo('user'), getAllBookingOrder);

router.patch('/contactUs', authMiddleWare, allowTo('user'), contactUsValidator, contactUs);

module.exports = router;