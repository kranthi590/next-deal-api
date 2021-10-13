const Sequelize = require('sequelize');
const { getConnection } = require('../mysql');

const SupplierCategoryMapping = getConnection().define(
  'supplier_category_mappings',
  {
    supplier_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    category_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  { timestamps: false },
);

module.exports = {
  SupplierCategoryMapping,
};
