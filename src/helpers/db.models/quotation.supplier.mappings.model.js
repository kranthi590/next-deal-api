const Sequelize = require('sequelize');
const { getConnection } = require('../mysql');

const QuotationToSupplierMappings = getConnection().define(
  'quotation_request_supplier_mappings',
  {
    supplier_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'suppliers',
        key: 'id',
      },
    },
    quotation_request_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'quotation_requests',
        key: 'id',
      },
    },
  },
  { timestamps: false, tableName: 'quotation_request_supplier_mappings' },
);

module.exports = {
  QuotationToSupplierMappings,
};
