const mongoose = require('mongoose');

const monthlySchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  userPhone: {
    type: String,
    required: true,
    ref: 'User',
  },
  address: {
    type: String,
    required: true
  },
  details: {
    type: String,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model("ContactU", monthlySchema);