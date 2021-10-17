const Sequelize = require('sequelize');

module.exports = (sequelize) => ({
  Role: sequelize.define(
    'supplier_category_mappings',
    {
      supplier_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: 'suppliers',
        referencesKey: 'id',
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: 'categories',
        referencesKey: 'id',
      },
    },
    { timestamps: false },
  ),
});
