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


// @desc Completed Booking Daily
// @route PATCH api/v1/bookingDaily/:id
// @protect Protect/Admin
exports.completedBookingDaily = asyncHandler(async (req, res) => {
  const completedBookingDaily = await Daily.findByIdAndUpdate(
    req.params.id,
    { completed: true },
    { new: true }
  );

  res.status(StatusCodes.OK).json({ status: "Success", completedBookingDaily });
})






// @desc Get All Booking Daily
// @route GET api/v1/bookingDaily?completed=true
// @protect Protect/Admin
exports.getAllBookingDaily = asyncHandler(async (req, res) => {
  const countDocument = await Daily.countDocuments();
  const { mongooseQuery, paginationResult } = new ApiFeatures(Daily.find({ completed: req.query.completed }), req.query)
    .paginate(countDocument);
  
  const allBookingDaily = await mongooseQuery;
  res.status(StatusCodes.OK).json({ status: "Success", count: allBookingDaily.length, paginationResult, allBookingDaily });
});

// @desc Search By Day in Booking Daily
// @route GET api/v1/bookingDaily/search?name= Mahmoud ha&completed=true
// @protect Protect/Admin
exports.searchByQueryStringInBookingDaily = asyncHandler(async (req, res) => {
  const { start, end, name, completed } = req.query;
  if (name && completed) {
    const listName = name.split(' ');
    const filterList = listName.filter((el) => el !== '').join(" ");
    const bookingDailies = await Daily.find({ fullName: { $regex: filterList, $options: 'i' }, completed });
    return res.status(StatusCodes.OK).json({ status: "Success", count: bookingDailies.length, bookingDailies });
  }
  const bookingDailies = await Daily.find({
    $and: [
      { date: { $gte: start } },
      { date: { $lte: end } }
    ],
  }).sort('date');

  res.status(StatusCodes.OK).json({ status: "Success", count: bookingDailies.length, bookingDailies });
})
