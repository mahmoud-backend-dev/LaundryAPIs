const validatorMiddleWare = require('../../middleware/validatorMiddleware');
const { body, param } = require('express-validator');
const { BadRequest, NotFoundError  } = require('../../errors');
const User = require('../../models/User');
const ContactUs = require('../../models/ContactUs');

exports.signupValidator = [
  body('firstName').notEmpty().withMessage('First Name is requied'),
  body('lastName').notEmpty().withMessage('Last Name is requied'),
  body('phone').notEmpty().withMessage('phonel is requied')
    .custom(async (val) => {
      const user = await User.findOne({ phone: val });
      if (user) {
        throw new BadRequest(`this phone is used, choose anthor phone`)
      }
      return true
    }),
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

exports.registerAsAdminValidator = [
  body('firstName').notEmpty().withMessage('First Name is requied'),
  body('lastName').notEmpty().withMessage('Last Name is requied'),
  body('phone').notEmpty().withMessage('phonel is requied')
    .custom(async (val) => {
      const user = await User.findOne({ phone: val });
      if (user) {
        throw new BadRequest(`this phone is used, choose anthor phone`)
      }
      return true
    }),
  body('password').notEmpty().withMessage('Password is requied')
    .isLength({ min: 6 }).withMessage('Too short password'),
    body('confirmPassword').notEmpty().withMessage('Confirm password is requied')
      .custom((val, { req }) => {
        if (val !== req.body.password)
          throw new BadRequest('Password confirmation incorrect')
        req.body.role = 'admin'
        return true
    }),  
  validatorMiddleWare,
]

exports.loginValidator = [
  body('phone').notEmpty().withMessage('phone is requied'),
  body('password').notEmpty().withMessage('Password is requied'),
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

exports.deleteSpecificUserValidator = [
  param('id').custom(async (val) => {
    const user = await User.findById(val);
    if (!user)
      throw new NotFoundError(`No user founded for this ${val}`)
    return true
  }),
  validatorMiddleWare,
];


exports.contactUsValidator = [
  body('address').notEmpty().withMessage('Adress is required'),
  body('details').notEmpty().withMessage('Details is required'),
  validatorMiddleWare,
];

exports.deleteContactUsValidator = [
  param('id').custom(async (val) => {
    const user = await ContactUs.findById(val);
    if (!user)
      throw new NotFoundError(`No Contact Us founded for this ${val}`)
    return true
  }),
  validatorMiddleWare,
];

exports.getDeviceTokenValidator = [
  body('fcm_token').notEmpty().withMessage("Device Token Is Required"),
  validatorMiddleWare,
]


