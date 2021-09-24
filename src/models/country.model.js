const { Schema, model } = require('mongoose');

const CountrySchema = new Schema({
  _id: false,
  countryId: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true,
  },
  countryCode: {
    type: String,
    required: true,
    trim: true,
  },
  countryName: {
    type: String,
    required: true,
    trim: true,
  },
});

const Country = model('country', CountrySchema);

module.exports = Country;
