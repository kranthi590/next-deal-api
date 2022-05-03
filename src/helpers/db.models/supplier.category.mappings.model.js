const Sequelize = require('sequelize');
const { getConnection } = require('../mysql');

const SupplierCategoryMappings = getConnection().define(
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
    createdAt: {
      type: Sequelize.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: Sequelize.DATE,
      field: 'updated_at',
    },
  },
  { timestamps: true, tableName: 'supplier_category_mappings' },
);

module.exports = {
  SupplierCategoryMappings,
};
