const mongoose = require('mongoose');

const specialSchema = new mongoose.Schema({
  fullName: {
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
  completed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model("Special", specialSchema);