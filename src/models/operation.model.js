const { Schema, model } = require('mongoose');

const OperationSchema = new Schema({
  _id: false,
  operationId: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
});

const Operation = model('operation', OperationSchema);

module.exports = Operation;
