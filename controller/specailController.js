const { StatusCodes } = require('http-status-codes');
const asyncHandler = require('express-async-handler');
const Special = require('../models/Special');

// @desc Add Booking Special
// @route POST api/v1/bookingSpecial
// @protect Protect
exports.addBookingSpecial = asyncHandler(async (req, res) => {
  const bookingSpecial = await Special.create(req.body);
  res.status(StatusCodes.OK).json({ status: "Success", bookingSpecial });
}) 

// @desc Delete Booking Special
// @route DELETE api/v1/bookingSpecial/:id
// @protect Protect/Admin
exports.completedBookingSpecial = asyncHandler(async (req, res) => {
  const completedBookingSpecial = await Special.findByIdAndUpdate(
    req.params.id,
    { completed: true },
    { new: true }
  );

  res.status(StatusCodes.OK).json({ status: "Success", completedBookingSpecial });
})

// @desc Delete Booking Special
// @route DELETE api/v1/bookingSpecial/:id
// @protect Protect
exports.deleteBookingSpecial = asyncHandler(async (req, res) => {
  await Special.findByIdAndRemove(req.params.id);
  res.status(StatusCodes.NO_CONTENT).send();
});

// @desc Get All Booking Special
// @route GET api/v1/bookingSpecial?completed=true
// @protect Protect/Admin
exports.getAllBookingSpecial = asyncHandler(async (req, res) => {
  const allBookingSpecial = await Special.find({ completed: req.query.completed });
  res.status(StatusCodes.OK).json({ status: "Success", count: allBookingSpecial.length, allBookingSpecial });
})