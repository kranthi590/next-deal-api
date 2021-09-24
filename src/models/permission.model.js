const { Schema, model } = require('mongoose');

const PermissionSchema = new Schema({
  _id: false,
  permissionId: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true,
  },
  operationId: {
    type: String,
    required: true,
    trim: true,
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

const Permission = model('permission', PermissionSchema);

module.exports = Permission;
