const twilio = require('twilio')(process.env.ACCOUNT_SID_TWILIO, process.env.AUTH_TOKEN_TWILIO);

exports. sendSMS = async (option) => {
  await twilio.messages.create({
    from: process.env.MY_TWILIO_PHONE_NUMBER,
    to: option.to,
    body: `Your vericication code for registeration is : ${option.otp}`,
  });
};
