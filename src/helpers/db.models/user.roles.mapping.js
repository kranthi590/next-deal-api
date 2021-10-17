const Sequelize = require('sequelize');

module.exports = (sequelize) => ({
  UsersRolesMapping: sequelize.define(
    'users_roles_mappings',
    {
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: 'roles',
        referencesKey: 'id',
        field: 'role_id',
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: 'users',
        referencesKey: 'id',
        field: 'user_id',
      },
    },
    { timestamps: false },
  ),
});
