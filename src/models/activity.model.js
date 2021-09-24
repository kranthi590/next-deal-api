const { Schema, model } = require('mongoose');

const ActivitySchema = new Schema({
  _id: false,
  activityId: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true,
  },
  projectId: {
    type: String,
    required: true,
    trim: true,
  },
  userId: {
    type: String,
    required: true,
    trim: true,
  },
  activity: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
    trim: true,
  },
});

const Activity = model('activity', ActivitySchema);

module.exports = Activity;
