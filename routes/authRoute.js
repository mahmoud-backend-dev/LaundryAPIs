
const express = require('express');
const router = express.Router();
const {
  signup,
  varifyResetCodeForSignup,
  login,
  varifyResetCodeForPassword,
  forgetPassword,
  resetPassword,
  resendRestCodeForSignup,
  resendRestCodeForPassword,
  changePassword
} = require('../controller/authController')
const {
  signupValidator,
  varifyCodeValidator,
  loginValidator,
  forgetPasswordValidator,
  resetPasswordValidator,
  changePasswordValidator
} = require('../utils/validators/authValidator')


router.post('/signup', signupValidator, signup);
router.post('/signup/resendResetCode', forgetPasswordValidator, resendRestCodeForSignup);
router.post('/varifyResetCodeForSignup', varifyCodeValidator, varifyResetCodeForSignup);

router.post('/login', loginValidator, login);

router.post('/forgetPassword', forgetPasswordValidator, forgetPassword);
router.post('/forgetPassword/resendResetCode',forgetPasswordValidator, resendRestCodeForPassword);
router.post('/varifyResetCodeForPassword', varifyCodeValidator, varifyResetCodeForPassword);
router.post('/resetPassword',resetPasswordValidator,resetPassword)

router.post('/changePassword', changePasswordValidator, changePassword);

module.exports = router;