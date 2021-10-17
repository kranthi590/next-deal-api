const Sequelize = require('sequelize');
const { getConnection } = require('../mysql');

const UsersRolesMapping = getConnection().define(
  'users_roles_mappings',
  {
    roleId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'role_id',
      references: {
        model: 'roles',
        key: 'id',
      },
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  { timestamps: false },
);

module.exports = {
  UsersRolesMapping,
};
