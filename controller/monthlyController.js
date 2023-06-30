const { StatusCodes } = require('http-status-codes');
const asyncHandler = require('express-async-handler');
const Monthly = require('../models/Monthly');
const { sendPushNotification } = require('../utils/pushNotifi');
const { getAllDevicesToken } = require('./authController');

// @desc Add Booking Monthly
// @route POST api/v1/bookingMonthly
// @protect Protect
exports.addBookingMonthly = asyncHandler(async (req, res) => {
  const bookingMonthly = await Monthly.create(req.body);
  const allDevicesToken = await getAllDevicesToken();
  allDevicesToken.forEach((value) => {
    const message = {
      to:value,
          notification: {
              title: 'لديك حجز شهرى جديد',
              body: `${req.user.firstName} من`,
          },
      };
    sendPushNotification(message);
  })
  res.status(StatusCodes.OK).json({ status: "Success", bookingMonthly });
}) 

// @desc Get All Booking Monthly
// @route GET api/v1/bookingMonthly?completed=true
// @protect Protect/Admin
exports.getAllBookingMonthly = asyncHandler(async (req, res) => {
  const allBookingMonthly = await Monthly.find({ completed: req.query.completed });
  res.status(StatusCodes.OK).json({ status: "Success", count: allBookingMonthly.length, allBookingMonthly });
});

// @desc Search By Day in Booking Monthly
// @route GET api/v1/bookingMonthly/search?name= Mahmoud H&completed=true
// @protect Protect/Admin
exports.searchByQueryStringInBookingMonthly = asyncHandler(async (req, res) => {
  const { name, completed } = req.query;
  const listName = name.split(' ');
  const filterList = listName.filter((el) => el !== '').join(" ");
  const bookingMonthlies = await Monthly.find({ fullName: { $regex: filterList, $options: 'i' }, completed });
  return res.status(StatusCodes.OK).json({ status: "Success", count: bookingMonthlies.length, bookingMonthlies });
})