const { Schema, model } = require('mongoose');

const BuyerSchema = new Schema({
  _id: false,
  buyerId: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true,
  },
  userId: {
    type: String,
    required: true,
    trim: true,
  },
  businessName: {
    type: String,
    required: true,
    trim: true,
  },
  businessType: {
    type: String,
    required: true,
    trim: true,
  },
  services: {
    type: String,
    required: true,
    trim: true,
  },
  businessAddressId: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
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

const Buyer = model('buyer', BuyerSchema);

module.exports = Buyer;
