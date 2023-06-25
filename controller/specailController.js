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

// @desc Get All Booking Special
// @route GET api/v1/bookingSpecial?completed=true
// @protect Protect/Admin
exports.getAllBookingSpecial = asyncHandler(async (req, res) => {
  const allBookingSpecial = await Special.find({ completed: req.query.completed });
  res.status(StatusCodes.OK).json({ status: "Success", count: allBookingSpecial.length, allBookingSpecial });
});

// @desc Search By Day in Booking Special
// @route GET api/v1/bookingSpecial/search?name= Mahmoud Hamdi
// @protect Protect/Admin
exports.searchByQueryStringInBookingSpecial = asyncHandler(async (req, res) => {
  const { name } = req.query;
  const listName = name.split(' ');
  const filterList = listName.filter((el) => el !== '').join(" ");
  const bookingSpecials = await Special.find({ fullName: filterList });
  return res.status(StatusCodes.OK).json({ status: "Success", count: bookingSpecials.length, bookingSpecials });
})