const Sequelize = require('sequelize');

module.exports = (sequelize) => ({
  Categories: sequelize.define(
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
      createdAt: {
        type: Sequelize.DATE,
        field: 'created_at',
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        field: 'updated_at',
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    },
    { timestamps: false },
  ),
});
