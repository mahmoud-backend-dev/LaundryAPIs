const validatorMiddleWare = require('../../middleware/validatorMiddleware');
const { body } = require('express-validator');
const { BadRequest  } = require('../../errors');
const User = require('../../models/User');

exports.signupValidator = [
  body('firstName').notEmpty().withMessage('First Name is requied'),
  body('lastName').notEmpty().withMessage('Last Name is requied'),
  body('phone').notEmpty().withMessage('phonel is requied'),
  body('password').notEmpty().withMessage('Password is requied')
    .isLength({ min: 6 }).withMessage('Too short password'),
    body('confirmPassword').notEmpty().withMessage('Confirm password is requied')
      .custom((val, { req }) => {
        if (val !== req.body.password)
          throw new BadRequest('Password confirmation incorrect')
        return true
    }),  
  validatorMiddleWare,
]

exports.varifyCodeValidator = [
  body('phone').notEmpty().withMessage('phone is requied'),
  body('resetCode').notEmpty().withMessage('Reset code is required'),
  validatorMiddleWare,
]

exports.loginValidator = [
  body('phone').notEmpty().withMessage('phone is requied'),
  body('password').notEmpty().withMessage('Password is requied'),
validatorMiddleWare,
]

exports.forgetPasswordValidator = [
  body('phone').notEmpty().withMessage('phone is requied'),
  validatorMiddleWare,
]

exports.resetPasswordValidator = [
  body('phone').notEmpty().withMessage('phone is requied'),
  body('newPassword').notEmpty().withMessage('New Password is requied'),
  validatorMiddleWare,
]

exports.changePasswordValidator = [
  body('phone').notEmpty().withMessage('Phone is required'),
  body('currentPass').notEmpty().withMessage('Current Password is required')
    .custom(async (val, { req }) => {
      const user = await User.findOne({
        phone: req.body.phone,
      });
      const isMatch = await user.comparePassword(val);
      if (!user || !isMatch)
        throw new BadRequest('Phone or Password incorrect');
    }),
  body("newPassword").notEmpty().withMessage("New Password is required")
  .isLength({ min: 6 }).withMessage('Too short password'),
  body('confirmPassword').notEmpty().withMessage('Confirm password is requied')
    .custom((val, { req }) => {
      if (val !== req.body.newPassword)
        throw new BadRequest('Password confirmation incorrect')
      return true
    }),  
  validatorMiddleWare,
]


