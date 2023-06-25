const validatorMiddleWare = require('../../middleware/validatorMiddleware');
const { body, param, query } = require('express-validator');
const { NotFoundError, BadRequest } = require('../../errors');
const Daily = require('../../models/Daily');

exports.addDailyValidator = [
  body('fullName').notEmpty().withMessage('Full Name is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('userPhone').notEmpty().withMessage('User Phone is required'),
  body('clientPhone').notEmpty().withMessage('Client Phone is required'),
  body('date').notEmpty().withMessage('Date is required'),
  body('time').notEmpty().withMessage('Time is required'),
  validatorMiddleWare,
]

exports.deleteDailyValidator = [
  param('id').custom(async (val) => {
    const daily = await Daily.findById(val)
    if (!daily)
      throw new NotFoundError(`No booking daily for this ${val}`)
    return true
  }),
  validatorMiddleWare,
];

exports.getAllBookingValidator = [
  query('completed').isBoolean().withMessage('Completed parameter must be a boolean true or false'),
  validatorMiddleWare
];


