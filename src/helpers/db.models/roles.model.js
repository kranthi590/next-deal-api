const Sequelize = require('sequelize');
const { getConnection } = require('../mysql');

const Roles = getConnection().define(
  'roles',
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
  {
    timestamps: false,
    tableName: 'roles',
    freezeTableName: true,
    paranoid: true,
  },
);
Roles.sync({ force: false });

module.exports = {
  Roles,
};
