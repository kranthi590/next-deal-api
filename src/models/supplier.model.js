const { Schema, model } = require('mongoose');

const SupplierSchema = new Schema({
  _id: false,
  supplierId: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true,
  },
  userName: {
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
  serviceLocation: {
    type: String,
    required: true,
    trim: true,
  },
  businessAddressId: {
    type: String,
    required: true,
    trim: true,
  },
  businessEmailId: {
    type: String,
    required: true,
    trim: true,
  },
  categoryId: {
    type: String,
    required: true,
    trim: true,
  },
  registeredDate: {
    type: Date,
    required: true,
  },
  additionalData: {
    type: String,
    required: true,
    trim: true,
  },
});

const Supplier = model('supplier', SupplierSchema);

module.exports = Supplier;
