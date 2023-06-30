const FCM = require('fcm-node');
const fcm = new FCM(process.env.SERVER_KEY);




exports.sendPushNotification = (message) => {
  fcm.send(message, function (err, response) {
    if (err) {
      console.log("Respponse:! " + response);
      throw err;
    } else {
      console.log("Successfully sent with response: ", response);
    }

  })
}