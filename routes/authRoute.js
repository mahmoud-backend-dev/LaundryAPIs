
const express = require('express');
const router = express.Router();

const authMiddleWare = require('../middleware/authMiddleware');

const {
  signup,
  login,
  resetPassword,
  changePassword,
  allowTo,
  getAllUsers,
  deleteSpecificUser,
  getAllBookingOrder,
  deleteUserData,
  contactUs,
  changePasswordAdmin,
  deleteContactUs,
  getAllContactUs
} = require('../controller/authController')
const {
  signupValidator,
  loginValidator,
  resetPasswordValidator,
  changePasswordValidator,
  deleteSpecificUserValidator,
  contactUsValidator,
  deleteContactUsValidator,
  registerAsAdminValidator,
  getDeviceTokenValidator
} = require('../utils/validators/authValidator')

const { getDeviceToken } = require('../utils/getDviceToken');

router.post('/getDeviceToken', authMiddleWare, allowTo('admin'), getDeviceTokenValidator, getDeviceToken);

router.post('/signup', signupValidator, signup);
router.post('/admin/register', registerAsAdminValidator, signup);

router.post('/login', loginValidator, login);


router.post('/resetPassword',resetPasswordValidator,resetPassword)

router.post('/changePassword', changePasswordValidator, changePassword);

router.get('/users', authMiddleWare, allowTo('admin'), getAllUsers);
router.delete('/users/:id', authMiddleWare, allowTo('admin'), deleteSpecificUserValidator, deleteSpecificUser);
router.delete('/deleteMe', authMiddleWare, allowTo('user'),deleteUserData);

router.get('/users/bookingOrder', authMiddleWare, allowTo('user'), getAllBookingOrder);

router.route('/contactUs')
  .post(authMiddleWare, allowTo('user'), contactUsValidator, contactUs)
  .get(authMiddleWare, allowTo('admin'), getAllContactUs);
router.delete('/contactUs/:id', authMiddleWare, allowTo('admin'), deleteContactUsValidator, deleteContactUs);

router.patch('/admin/changePassword', authMiddleWare, allowTo('admin'), changePasswordValidator, changePasswordAdmin);
module.exports = router;