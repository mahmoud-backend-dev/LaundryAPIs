const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Get Device Token To Sent Notification
exports.getDeviceToken = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      deviceToken:req.body.fcm_token
    }
  )
  res.status(200).json({ status: "Success" });
});




