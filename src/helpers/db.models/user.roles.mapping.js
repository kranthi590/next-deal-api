const Sequelize = require('sequelize');
const { getConnection } = require('../mysql');

const UsersRolesMappings = getConnection().define(
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
    createdAt: {
      type: Sequelize.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: Sequelize.DATE,
      field: 'updated_at',
    },
  },
  { timestamps: true, tableName: 'users_roles_mappings' },
);

module.exports = {
  UsersRolesMappings,
};
