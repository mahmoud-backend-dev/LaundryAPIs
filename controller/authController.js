const crypto = require('crypto');
const { StatusCodes } = require('http-status-codes');
const { CustomErrorAPI, BadRequest, NotFoundError , UnauthenticatedError } = require('../errors');
const asyncHandler = require('express-async-handler');
const {sendSMS} = require('../utils/sendSMS');
const User = require('../models/User');
const { santizeData } = require('../utils/santizeData');

const hashedResetCodeByCrypto = (resetCode) => crypto.createHash('sha256').update(resetCode).digest('hex');

let ph;

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
  let user = await User.findOne({ phone: req.body.phone });
  if (user && !user.resetVerifyForSignup) {
        // Generate reset code 
        const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
        // hash reset code than store in db
        const hashedResetCode = hashedResetCodeByCrypto(resetCode);
        user.hashedResetCodeForSignup = hashedResetCode;

        user.resetVerifyForSignup = false;
        // Send reset code to phone number for varification
        const option = {
          to: user.phone,
          otp:resetCode
        };
        try {
          await sendSMS(option)
        } catch (error) {
          user.hashedResetCodeForSignup = undefined;

          user.resetVerifyForSignup = undefined;
          await user.updateOne(req.body);
          await user.save();
          throw new CustomErrorAPI('There is an error in sending phone', StatusCodes.INTERNAL_SERVER_ERROR);
        }
        await user.updateOne(req.body);
        await user.save();
  } else if(!user) {
    user = new User(req.body);
    // Generate reset code 
    const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
    // hash reset code than store in db
    const hashedResetCode = hashedResetCodeByCrypto(resetCode);
    user.hashedResetCodeForSignup = hashedResetCode;

    user.resetVerifyForSignup = false;
    // Send reset code to phone number for varification
    const option = {
      to: user.phone,
      otp:resetCode
    };
    try {
      await sendSMS(option);
    } catch (error) {
      user.hashedResetCodeForSignup = undefined;

      user.resetVerifyForSignup = undefined;
      await user.save();
      throw new CustomErrorAPI('There is an error in sending phone', StatusCodes.INTERNAL_SERVER_ERROR);
    }
    await user.save();
  } else {
    throw new BadRequest('Phone is used choose anther phone')
  }
  res.status(StatusCodes.OK).json({ status: 'Success', message: 'Reset code sent to phone' });
});

// @desc Verify Reset Code For Signup
// @route POST /api/v1/auth/varifyResetCodeForSignup
// @protect Public
exports.varifyResetCodeForSignup = asyncHandler(async (req, res, next) => {

  const hashedResetCode = hashedResetCodeByCrypto(req.body.resetCode);

  const user = await User.findOne({
    phone: req.body.phone,
    hashedResetCodeForSignup: hashedResetCode,
  });

  if (!user)
    throw new BadRequest(`Reset code invalid or no phone for this: ${req.body.phone}`)

  user.hashedResetCodeForSignup = undefined;
  user.resetVerifyForSignup = true;
  await user.save();
  await user.hashedPassword();
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({ message: "Success", token, data: santizeData(user) });
});

// @desc Resend Reset Code For Signup
// @route POST /api/v1/auth/signup/resendResetCode
// @protect Public
exports.resendRestCodeForSignup = asyncHandler(async (req, res) => {
  // Get User by phone
  const user = await User.findOne({ phone: req.body.phone });
  if (!user)
    throw new NotFoundError(`There is no user with that phone ${req.body.phone}`);
  
  // Generate reset code (4-digit)
  const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
  const hashedResetCode = hashedResetCodeByCrypto(resetCode);
  user.hashedResetCodeForSignup = hashedResetCode;
  user.resetVerifyForSignup = false;
  await user.save();
  const option = {
    to: user.phone,
    otp:resetCode
  };
  try {
    await sendSMS(option);
  } catch (error) {
    user.hashedResetCodeForSignup = undefined;
    user.resetVerifyForSignup = undefined;
    await user.save();
    throw new CustomErrorAPI('There is an error in sending OTP', StatusCodes.INTERNAL_SERVER_ERROR);
  };
  res.status(StatusCodes.OK).json({ status: 'Success', message: 'Reset code sent to phone' })
});

// @desc Resend Reset Code For Password
// @route POST /api/v1/auth/forgetPassword/resendResetCode
// @protect Public
exports.resendRestCodeForPassword = asyncHandler(async (req, res) => {
  // Get User by phone
  const user = await User.findOne({ phone: req.body.phone });
  if (!user)
    throw new NotFoundError(`There is no user with that phone ${req.body.phone}`);
  
  // Generate reset code (4-digit)
  const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
  const hashedResetCode = hashedResetCodeByCrypto(resetCode);
  user.hashedResetCodeForPassword = hashedResetCode;
  user.resetVerifyForPassword = false;
  await user.save();
  const option = {
    to: user.phone,
    otp:resetCode
  };
  try {
    await sendSMS(option);
  } catch (error) {
    user.hashedResetCodeForPassword = undefined;
    user.resetVerifyForPassword = undefined;
    await user.save();
    throw new CustomErrorAPI('There is an error in sending OTP', StatusCodes.INTERNAL_SERVER_ERROR);
  };
  res.status(StatusCodes.OK).json({ status: 'Success', message: 'Reset code sent to phone' })
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
  res.status(StatusCodes.OK).json({ data: santizeData(user), token });
});

// @desc Forget Password
// @route POST /api/v1/auth/forgetPassword
// @protect Public
exports.forgetPassword = asyncHandler(async (req, res) => {
  // Get User by phone
  const user = await User.findOne({ phone: req.body.phone });
  if (!user)
    throw new NotFoundError(`There is no user with that phone ${req.body.phone}`);
  
  // Generate reset code (4-digit)
  const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
  const hashedResetCode = hashedResetCodeByCrypto(resetCode);
  user.hashedResetCodeForPassword = hashedResetCode;
  user.resetVerifyForPassword = false;
  await user.save();
  const option = {
    to: user.phone,
    otp:resetCode
  };
  try {
    await sendSMS(option);
  } catch (error) {
    user.hashedResetCodeForPassword = undefined;
    user.resetVerifyForPassword = undefined;
    await user.save();
    throw new CustomErrorAPI('There is an error in sending OTP', StatusCodes.INTERNAL_SERVER_ERROR);
  };
  res.status(StatusCodes.OK).json({ status: 'Success', message: 'Reset code sent to phone' })
});

// @desc Verify Reset Code For Password
// @route POST /api/v1/auth/varifyResetCodeForPassword
// @protect Public
exports.varifyResetCodeForPassword = asyncHandler(async (req, res) => {
  const hashedResetCode = hashedResetCodeByCrypto(req.body.resetCode);
  // Get user based on reset code
  const user = await User.findOne({
    phone: req.body.phone,
    hashedResetCodeForPassword: hashedResetCode,
  });

  if (!user)
    throw new BadRequest(`Reset code invalid or expired or no phone for this: ${req.body.phone} `)
  user.resetVerifyForPassword = true;
  await user.save();
  res.status(StatusCodes.OK).json({ status: "Success" });
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
// @route POST /api/v1/auth/changePassword
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
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ token, data: santizeData(user) });
});

// @desc Get All Users
// @route GET /api/v1/auth/users
// @protect Protect/Admin Only
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
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
  const result1 = { daily: [], monthly: [], special: [], yearly: [] };
  const result2 = { daily: [], monthly: [], special: [], yearly: [] };
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
        resetVerifyForSignup: 0,
        __v: 0,
      }
    },
    { $sort: { "daily.date": 1 } },
  ],
  );
  
  // Handle to aggregation on data booking monthly
  const allBookingMonthly = await User.aggregate([
    {
      $lookup: {
        from: 'monthlies',
        localField: 'phone',
        foreignField: 'userPhone',
        as: 'monthly'
      },
    },
    {
      $unwind: '$monthly'
    },
    {
      $match: { "monthly.userPhone": req.user.phone }
    },
    {
      $project: {
        _id: 0,
        firstName: 0,
        lastName: 0,
        phone: 0,
        password: 0,
        role: 0,
        resetVerifyForSignup: 0,
        __v: 0,
      }
    },
    { $sort: { createdAt: -1 } },
  ],
  );

  // Handle to aggregation on data booking monthly
  const allBookingSpecial = await User.aggregate([
    {
      $lookup: {
        from: 'specials',
        localField: 'phone',
        foreignField: 'userPhone',
        as: 'special'
      },
    },
    {
      $unwind: '$special'
    },
    {
      $match: { "special.userPhone": req.user.phone }
    },
    {
      $project: {
        _id: 0,
        firstName: 0,
        lastName: 0,
        phone: 0,
        password: 0,
        role: 0,
        resetVerifyForSignup: 0,
        __v: 0,
      }
    },
    { $sort: { createdAt: -1 } },
  ],
  );

  // Handle to aggregation on data booking yearly
  const allBookingYearly = await User.aggregate([
    {
      $lookup: {
        from: 'yearlies',
        localField: 'phone',
        foreignField: 'userPhone',
        as: 'yearly'
      },
    },
    {
      $unwind: '$yearly'
    },
    {
      $match: { "yearly.userPhone": req.user.phone }
    },
    {
      $project: {
        _id: 0,
        firstName: 0,
        lastName: 0,
        phone: 0,
        password: 0,
        role: 0,
        resetVerifyForSignup: 0,
        __v: 0,
      }
    },
    { $sort: { createdAt: -1 } },
  ],
  );

  // Handle to show data booking daily
  allBookingDaily.filter((obj1) => obj1["daily"]["completed"] === true).map((obj2) => {
    result1.daily.push(Object.values(obj2)[0]);
  })
  allBookingDaily.filter((obj1) => obj1["daily"]["completed"] === false).map((obj2) => {
    result2.daily.push(Object.values(obj2)[0]);
  });
  
  // Handle to show data booking monthly
  allBookingMonthly.filter((obj1) => obj1["monthly"]["completed"] === true).map((obj2) => {
    result1.monthly.push(Object.values(obj2)[0]);
  })
  allBookingMonthly.filter((obj1) => obj1["monthly"]["completed"] === false).map((obj2) => {
    result2.monthly.push(Object.values(obj2)[0]);
  });


  // Handle to show data booking special
  allBookingSpecial.filter((obj1) => obj1["special"]["completed"] === true).map((obj2) => {
    result1.special.push(Object.values(obj2)[0]);
  })
  allBookingSpecial.filter((obj1) => obj1["special"]["completed"] === false).map((obj2) => {
    result2.special.push(Object.values(obj2)[0]);
  });

  // Handle to show data booking yearly
  allBookingYearly.filter((obj1) => obj1["yearly"]["completed"] === true).map((obj2) => {
    result1.yearly.push(Object.values(obj2)[0]);
  })
  allBookingYearly.filter((obj1) => obj1["yearly"]["completed"] === false).map((obj2) => {
    result2.yearly.push(Object.values(obj2)[0]);
  });
  
  arrayCompleted.push(result1);

  arrayNonCompleted.push(result2);

  // console.log(allBookingMonthly);
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
})



