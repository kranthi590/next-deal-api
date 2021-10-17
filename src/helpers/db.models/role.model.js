const Sequelize = require('sequelize');

module.exports = (sequelize) => ({
  Role: sequelize.define(
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
  ),
});
