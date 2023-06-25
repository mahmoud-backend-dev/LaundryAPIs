const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin']
  }
});

userSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      userId: this._id,
      userName: `${this.firstName} ${this.lastName}`,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRED
    }
  )
};

userSchema.methods.hashedPassword = async function () {
  this.password = await bcrypt.hash(this.password, 12);
  this.save()
}


userSchema.methods.comparePassword = async function (checkPassword) {
  return await bcrypt.compare(checkPassword,this.password)
}


module.exports = mongoose.model('User', userSchema);