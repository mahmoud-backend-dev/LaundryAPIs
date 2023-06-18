const validatorMiddleWare = require('../../middleware/validatorMiddleware');
const { body, param } = require('express-validator');
const { NotFoundError } = require('../../errors');
const Yearly = require('../../models/Yearly');

exports.addYearlyValidator = [
  body('fullName').notEmpty().withMessage('Full Name is required'),
  body('userPhone').notEmpty().withMessage('User Phone is required'),
  body('clientPhone').notEmpty().withMessage('Client Phone is required'),
  validatorMiddleWare,
]

exports.deleteYearlyValidator = [
  param('id').custom(async (val) => {
    const yearly = await Yearly.findById(val)
    if (!yearly)
      throw new NotFoundError(`No booking yearly for this ${val}`)
    return true
  }),
  validatorMiddleWare,
];