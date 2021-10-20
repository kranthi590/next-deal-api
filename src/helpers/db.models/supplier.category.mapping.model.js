const Sequelize = require('sequelize');
const { getConnection } = require('../mysql');

const SupplierCategoryMapping = getConnection().define(
  'supplier_category_mappings',
  {
    supplier_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'suppliers',
        key: 'id',
      },
    },
    category_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
  },
  { timestamps: false },
);

module.exports = {
  SupplierCategoryMapping,
};
