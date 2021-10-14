const Sequelize = require('sequelize');
const { getConnection } = require('../mysql');

const SupplierCategoryMapping = getConnection().define(
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
);

module.exports = {
  SupplierCategoryMapping,
};
