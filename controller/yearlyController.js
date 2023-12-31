const { StatusCodes } = require('http-status-codes');
const asyncHandler = require('express-async-handler');
const Yearly = require('../models/Yearly');
const { sendPushNotification } = require('../utils/pushNotifi');
const { getAllDevicesToken } = require('./authController');

// @desc Add Booking Yearly
// @route POST api/v1/bookingYearly
// @protect Protect
exports.addBookingYearly = asyncHandler(async (req, res) => {
  const bookingYearly = await Yearly.create(req.body);
  const allDevicesToken = await getAllDevicesToken();
  allDevicesToken.forEach((value) => {
    const message = {
      to:value,
          notification: {
              title: 'لديك حجز سنوى جديد',
              body: `${req.user.firstName} من`,
          },
      };
    sendPushNotification(message);
  })
  res.status(StatusCodes.OK).json({ status: "Success", bookingYearly });
}) 

// @desc Delete Booking Yearly
// @route DELETE api/v1/bookingYearly/:id
// @protect Protect
exports.deleteBookingYearly = asyncHandler(async (req, res) => {
  await Yearly.findByIdAndRemove(req.params.id);
  res.status(StatusCodes.NO_CONTENT).send();
});

// @desc Get All Booking Yearly
// @route GET api/v1/bookingYearly?completed=true
// @protect Protect/Admin
exports.getAllBookingYearly = asyncHandler(async (req, res) => {
  const allBookingYearly = await Yearly.find({ completed: req.query.completed });
  res.status(StatusCodes.OK).json({ status: "Success", count: allBookingYearly.length, allBookingYearly });
})

// @desc Search By Day in Booking Yearly
// @route GET api/v1/bookingYearly/search?name= Mahmoud Hamdi
// @protect Protect/Admin
exports.searchByQueryStringInBookingYearly = asyncHandler(async (req, res) => {
  const { name, completed } = req.query;
  const listName = name.split(' ');
  const filterList = listName.filter((el) => el !== '').join(" ");
  const bookingYearlies = await Yearly.find({ fullName: { $regex: filterList, $options: 'i' }, completed });
  return res.status(StatusCodes.OK).json({ status: "Success", count: bookingYearlies.length, bookingYearlies });
})