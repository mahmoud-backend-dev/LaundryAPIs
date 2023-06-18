const validatorMiddleWare = require('../../middleware/validatorMiddleware');
const { body, param } = require('express-validator');
const { NotFoundError } = require('../../errors');
const Monthly = require('../../models/Monthly');

exports.addMonthlyValidator = [
  body('fullName').notEmpty().withMessage('Full Name is required'),
  body('userPhone').notEmpty().withMessage('User Phone is required'),
  body('clientPhone').notEmpty().withMessage('Client Phone is required'),
  validatorMiddleWare,
]

exports.deleteMonthlyValidator = [
  param('id').custom(async (val) => {
    const monthly = await Monthly.findById(val)
    if (!monthly)
      throw new NotFoundError(`No booking monthly for this ${val}`)
    return true
  }),
  validatorMiddleWare,
];