const { StatusCodes } = require('http-status-codes');
const asyncHandler = require('express-async-handler');
const Monthly = require('../models/Monthly');

// @desc Add Booking Monthly
// @route POST api/v1/bookingMonthly
// @protect Protect
exports.addBookingMonthly = asyncHandler(async (req, res) => {
  const bookingMonthly = await Monthly.create(req.body);
  res.status(StatusCodes.OK).json({ status: "Success", bookingMonthly });
}) 

// @desc Delete Booking Monthly
// @route DELETE api/v1/bookingMonthly/:id
// @protect Protect/Admin
exports.completedBookingMonthly = asyncHandler(async (req, res) => {
  const completedBookingMonthly = await Monthly.findByIdAndUpdate(
    req.params.id,
    { completed: true },
    { new: true }
  );

  res.status(StatusCodes.OK).json({ status: "Success", completedBookingMonthly });
})

// @desc Delete Booking Monthly
// @route DELETE api/v1/bookingMonthly/:id
// @protect Protect
exports.deleteBookingMonthly = asyncHandler(async (req, res) => {
  await Monthly.findByIdAndRemove(req.params.id);
  res.status(StatusCodes.NO_CONTENT).send();
});

// @desc Get All Booking Monthly
// @route GET api/v1/bookingMonthly?completed=true
// @protect Protect/Admin
exports.getAllBookingMonthly = asyncHandler(async (req, res) => {
  const allBookingMonthly = await Monthly.find({ completed: req.query.completed });
  res.status(StatusCodes.OK).json({ status: "Success", count: allBookingMonthly.length, allBookingMonthly });
})