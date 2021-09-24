const { Schema, model } = require('mongoose');

const CommuneSchema = new Schema({
  _id: false,
  communeId: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true,
  },
  regionId: {
    type: String,
    required: true,
    trim: true,
  },
  communeName: {
    type: String,
    required: true,
    trim: true,
  },
});

const Commune = model('commune', CommuneSchema);

module.exports = Commune;
