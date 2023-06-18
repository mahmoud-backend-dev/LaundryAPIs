const validatorMiddleWare = require('../../middleware/validatorMiddleware');
const { body, param } = require('express-validator');
const { NotFoundError } = require('../../errors');
const Special = require('../../models/Special');

exports.addSpecialValidator = [
  body('fullName').notEmpty().withMessage('Full Name is required'),
  body('userPhone').notEmpty().withMessage('User Phone is required'),
  body('clientPhone').notEmpty().withMessage('Client Phone is required'),
  validatorMiddleWare,
]

exports.deleteSpecialValidator = [
  param('id').custom(async (val) => {
    const special = await Special.findById(val)
    if (!special)
      throw new NotFoundError(`No booking special for this ${val}`)
    return true
  }),
  validatorMiddleWare,
];