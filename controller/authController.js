
const { StatusCodes } = require('http-status-codes');
const { BadRequest, NotFoundError, UnauthenticatedError } = require('../errors');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { santizeData } = require('../utils/santizeData');
const ContactUs = require('../models/ContactUs');

//  allwoed to (user permission)
exports.allowTo = (...roles) => (asyncHandler(async (req, res, next) => {
  // Access roles
  // Access Register user (req.user)
  if (!roles.includes(req.user.role))
    throw new UnauthenticatedError("You are not allowed to access this route");
  next()
}))

// @desc Signup
// @route POST api/v1/auth/signup
// @protect Public
exports.signup = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body)
  await user.hashedPassword();
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ status: 'Success', token, user: santizeData(user) });
});

// @desc Login
// @route POST /api/v1/auth/login
// @protect Public
exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ phone: req.body.phone });
  if (user.hashedResetCodeForSignup) {
    throw new BadRequest('Verifiy reset code before login')
  }
  const isMatch = await user.comparePassword(req.body.password);
  if (!user || !isMatch)
    throw new BadRequest('Phone or Password incorrect');
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: santizeData(user), token });
});

// @desc Reset Password
// @route POST /api/v1/auth/resetPassword
// @protect Public
exports.resetPassword = asyncHandler(async (req, res) => {
  // Get user based on phone
  const user = await User.findOne({ phone: req.body.phone })
  if (!user)
    throw new NotFoundError(`There is no user with that phone ${req.body.phone}`)
  if (!user.resetVerifyForPassword)
    throw new BadRequest('Reset code not verified');
  
  user.password = req.body.newPassword;
  user.hashedResetCodeForPassword = undefined;
  user.resetVerifyForPassword = undefined;
  await user.hashedPassword();
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ token, data: santizeData(user) });
});

// @desc Change Password
// @route PATCH /api/v1/auth/changePassword
// @protect Public
exports.changePassword = asyncHandler(async (req, res) => {
  const user = await User.findOneAndUpdate(
    {
      phone: req.body.phone
    },
    {
      password: req.body.newPassword
    },
    {
      new: true,
    }
  );
  await user.hashedPassword();

  res.status(StatusCodes.OK).json({ data: santizeData(user) });
});

// @desc Get All Users
// @route GET /api/v1/auth/users
// @protect Protect/Admin Only
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({role:'user'}).select('-password -__v');
  if (Object.keys.length === 0)
    throw new NotFoundError('No users founded')
  
  res.status(StatusCodes.OK).json({ status: "Success", users });
});

// @desc Delete Specific User
// @route DELETE /api/v1/auth/users/:id
// @protect Protect/Admin Only
exports.deleteSpecificUser = asyncHandler(async (req, res) => {
  await User.findByIdAndRemove(req.params.id);
  res.status(StatusCodes.NO_CONTENT).send();
});

// @desc Get All User Booking Order
// @route DELETE /api/v1/auth/users/bookingOrder
// @protect Protect/User
exports.getAllBookingOrder = asyncHandler(async (req, res) => {
  const arrayCompleted = [];
  const arrayNonCompleted = [];

  // Handle to aggregation on data booking daily
  const allBookingDaily = await User.aggregate([
    {
      $lookup: {
        from: 'dailies',
        localField: 'phone',
        foreignField: 'userPhone',
        as: 'daily'
      },
    },
    {
      $unwind: '$daily'
    },
    {
      $match: { "daily.userPhone": req.user.phone }
    },
    {
      $project: {
        _id: 0,
        firstName: 0,
        lastName: 0,
        phone: 0,
        password: 0,
        role: 0,
        address:0,
        details: 0,
        __v: 0,
      }
    },
    { $sort: { "daily.date": 1 } },
  ],
  );
  
  // Handle to show data booking daily
  allBookingDaily.filter((obj1) => obj1["daily"]["completed"] === true).map((obj2) => {
    arrayCompleted.push(Object.values(obj2)[0]);
  })
  allBookingDaily.filter((obj1) => obj1["daily"]["completed"] === false).map((obj2) => {
    arrayNonCompleted.push(Object.values(obj2)[0]);
  });

  res.status(StatusCodes.OK).json({ status: "Success", arrayCompleted, arrayNonCompleted });
});

// @desc Delete User Data
// @route DELETE /api/v1/auth/users/deleteMe
// @protect Protect/User
exports.deleteUserData = asyncHandler(async (req, res) => {
  console.log("teas");
  await User.findOneAndRemove({
    _id: req.user._id
  });
  res.status(StatusCodes.NO_CONTENT).send();
});

// @desc Change Password (Admin)
// @route PATCH /api/v1/auth/admin/changePassword
// @protect Protect/Admin
exports.changePasswordAdmin = asyncHandler(async (req, res) => {
  const user = await User.findOneAndUpdate(
    {
      phone: req.body.phone,
      role: 'admin'
    },
    {
      password: req.body.newPassword
    },
    {
      new: true,
    }
  );
  await user.hashedPassword();

  res.status(StatusCodes.OK).json({ data: santizeData(user) })
});

// @desc Contact Us
// @route POST /api/v1/auth/contactUs
// @protect Protect/User
exports.contactUs = asyncHandler(async (req, res) => {
  req.body.fullName = `${req.user.firstName} ${req.user.lastName}`;
  req.body.userPhone = req.user.phone;
  const contactUs = await ContactUs.create(req.body);
  res.status(StatusCodes.OK).json({ status: "Success", contactUs });
});

// @desc Contact Us
// @route DELETE /api/v1/auth/contactUs/:id
// @protect Protect/User
exports.deleteContactUs = asyncHandler(async (req, res) => {
  await ContactUs.findByIdAndRemove(req.params.id);
  res.status(StatusCodes.NO_CONTENT).send();
});

// @desc Get All Contact Us
// @route GET /api/v1/auth/contactUs/:id
// @protect Protect/User
exports.getAllContactUs = asyncHandler(async (req, res) => {
  const allContactUs = await ContactUs.find({});
  res.status(StatusCodes.OK).json({ status: "Success", count: allContactUs.length, allContactUs });
});








