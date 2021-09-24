const { Schema, model } = require('mongoose');

const CategorySchema = new Schema({
  _id: false,
  categoryId: {
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
  type: {
    type: String,
    required: true,
    trim: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
});

const Category = model('category', CategorySchema);

module.exports = Category;
