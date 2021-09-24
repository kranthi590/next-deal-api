const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  _id: false,
  userId: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true,
  },
  roleId: {
    type: String,
    required: true,
    trim: true,
  },
  addressId: {
    type: String,
    required: true,
    trim: true,
  },
  categoryId: {
    type: String,
    required: true,
    trim: true,
  },
  customerId: {
    type: String,
    required: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  secondName: {
    type: String,
    required: true,
    trim: true,
  },
  middleName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  emailId: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber1: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber2: {
    type: String,
    required: true,
    trim: true,
  },
  registeredDate: {
    type: Date,
    required: true,
  },
  lastLoginDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  type: {
    type: String,
    required: true,
    trim: true,
  },
  additionalData: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    default: 'basic',
    enum: ['basic', 'supervisor', 'admin'],
  },
});

const User = model('user', UserSchema);

module.exports = User;
