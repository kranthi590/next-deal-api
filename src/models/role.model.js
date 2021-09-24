const { Schema, model } = require('mongoose');

const RoleSchema = new Schema({
  _id: false,
  roleId: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true,
  },
  permissionId: {
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

const Role = model('role', RoleSchema);

module.exports = Role;
