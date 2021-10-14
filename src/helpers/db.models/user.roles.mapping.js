const Sequelize = require('sequelize');
const { getConnection } = require('../mysql');

const UsersRolesMapping = getConnection().define(
  'users_roles_mappings',
  {
    roleId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: 'roles',
      referencesKey: 'id',
      field: 'role_id',
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: 'users',
      referencesKey: 'id',
      field: 'user_id',
    },
  },
  { timestamps: false },
);

module.exports = {
  UsersRolesMapping,
};
