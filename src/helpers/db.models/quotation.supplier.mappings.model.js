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
    createdAt: {
      type: Sequelize.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: Sequelize.DATE,
      field: 'updated_at',
    },
  },
  {
    timestamps: true,
    tableName: 'quotation_request_supplier_mappings',
    indexes: [
      {
        fields: ['supplier_id', 'quotation_request_id'],
        unique: true,
        name: 'quotation_supplier_unique',
      },
    ],
  },
);

module.exports = {
  QuotationToSupplierMappings,
};
