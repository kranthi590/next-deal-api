const { Schema, model } = require('mongoose');

const RegionSchema = new Schema({
  _id: false,
  regionId: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true,
  },
  countryId: {
    type: String,
    required: true,
    trim: true,
  },
  regionName: {
    type: String,
    required: true,
    trim: true,
  },
});

const Region = model('region', RegionSchema);

module.exports = Region;
