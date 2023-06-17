const crypto = require('crypto');
const { StatusCodes } = require('http-status-codes');
const { CustomErrorAPI, BadRequest, NotFoundError } = require('../errors');
const asyncHandler = require('express-async-handler');
const {sendSMS} = require('../utils/sendSMS');
const User = require('../models/User');
const { santizeData } = require('../utils/santizeData');

const hashedResetCodeByCrypto = (resetCode) => crypto.createHash('sha256').update(resetCode).digest('hex');


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
})