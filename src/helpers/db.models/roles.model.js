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
    createdAt: {
      type: Sequelize.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: Sequelize.DATE,
      field: 'updated_at',
    },
  },
  {
    timestamps: true,
    tableName: 'roles',
  },
);

Roles.sync({ force: false });

module.exports = {
  Roles,
};
