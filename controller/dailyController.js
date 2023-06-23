const { StatusCodes } = require('http-status-codes');
const asyncHandler = require('express-async-handler');
const Daily = require('../models/Daily');
const ApiFeatures = require('../utils/apiFeaturs');




// @desc Add Booking Daily
// @route POST api/v1/bookingDaily
// @protect Protect
exports.addBookingDaily = asyncHandler(async (req, res) => {
  const bookingDaily = await Daily.create(req.body);
  res.status(StatusCodes.OK).json({ status: "Success", bookingDaily });
}) 


// @desc Delete Booking Daily
// @route DELETE api/v1/bookingDaily/:id
// @protect Protect/Admin
exports.completedBookingDaily = asyncHandler(async (req, res) => {
  const completedBookingDaily = await Daily.findByIdAndUpdate(
    req.params.id,
    { completed: true },
    { new: true }
  );

  res.status(StatusCodes.OK).json({ status: "Success", completedBookingDaily });
})


// @desc Delete Booking Daily
// @route DELETE api/v1/bookingDaily/:id
// @protect Protect/Admin
exports.deleteBookingDaily = asyncHandler(async (req, res) => {
  await Daily.findByIdAndRemove(req.params.id);
  res.status(StatusCodes.NO_CONTENT).send();
});



// @desc Get All Booking Daily
// @route GET api/v1/bookingDaily?completed=true
// @protect Protect/Admin
exports.getAllBookingDaily = asyncHandler(async (req, res) => {
  const countDocument = await Daily.countDocuments();
  const { mongooseQuery, paginationResult } = new ApiFeatures(Daily.find({ completed: req.query.completed }), req.query)
    .paginate(countDocument);
  
  const allBookingDaily = await mongooseQuery;
  res.status(StatusCodes.OK).json({ status: "Success", count: allBookingDaily.length, paginationResult, allBookingDaily });
})