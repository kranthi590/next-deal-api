const Sequelize = require('sequelize');
const { getConnection } = require('../mysql');

const Categories = getConnection().define(
  'categories',
  {
    name: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    active: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    created_at: Sequelize.DATE,
    updated_at: Sequelize.DATE,
  },
  { timestamps: false },
);

module.exports = {
  Categories,
};
