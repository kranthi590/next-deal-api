const { Schema, model } = require('mongoose');

const AddressSchema = new Schema({
  _id: false,
  addressId: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true,
  },
  addressLine1: {
    type: String,
    required: true,
    trim: true,
  },
  addressLine2: {
    type: String,
    required: true,
    trim: true,
  },
  addressLine3: {
    type: String,
    required: true,
    trim: true,
  },
  communeId: {
    type: String,
    required: true,
    trim: true,
  },
  regionId: {
    type: String,
    required: true,
    trim: true,
  },
  countryId: {
    type: Boolean,
    required: true,
  },
  phoneNumber1: {
    type: Boolean,
    required: true,
  },
  phoneNumber2: {
    type: Boolean,
    required: true,
  },
  additionalData: {
    type: Boolean,
    required: true,
    trim: true,
  },
});

const Address = model('address', AddressSchema);

module.exports = Address;
