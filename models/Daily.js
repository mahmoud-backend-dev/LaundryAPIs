const mongoose = require('mongoose');

const dailySchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  userPhone: {
    type: String,
    required: true,
    ref: 'User',
  },
  clientPhone: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Daily", dailySchema);