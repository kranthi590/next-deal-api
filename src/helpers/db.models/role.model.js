const Sequelize = require('sequelize');
const { getConnection } = require('../mysql');

const Role = getConnection().define(
  'role',
  {
    name: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    api_path: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
  },
  { timestamps: false },
);

module.exports = {
  Role,
};
