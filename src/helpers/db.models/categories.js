const Sequelize = require('sequelize');
const { getConnection } = require('../mysql');

const Categories = getConnection().define(
  'categories',
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    active: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: Sequelize.DATE,
      field: 'updated_at',
    },
  },
  { timestamps: true },
);

module.exports = {
  Categories,
};
