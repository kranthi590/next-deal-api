const Sequelize = require('sequelize');
const { CURRENCY_TYPE } = require('../constants');
const { getConnection } = require('../mysql');

const QuotationsResponse = getConnection().define(
  'quotation_responses',
  {
    quotationRequestId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'quotation_request_id',
      foreignKey: true,
      references: {
        model: 'quotation_requests',
        key: 'id',
      },
    },
    supplierId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'supplier_id',
      foreignKey: true,
      references: {
        model: 'suppliers',
        key: 'id',
      },
    },
    createdBy: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'created_by',
      foreignKey: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    netWorth: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'net_worth',
    },
    currency: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'currency',
      isIn: Object.values(CURRENCY_TYPE),
    },
    includesTax: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      default: false,
      field: 'includes_tax',
    },
    incoterm: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'incoterm',
    },
    paymentCondition: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'payment_condition',
    },
    deliveryDate: {
      type: Sequelize.DATE,
      allowNull: true,
      field: 'delivery_date',
    },
    validityDate: {
      type: Sequelize.DATE,
      allowNull: false,
      field: 'validity_date',
    },
    createdAt: {
      type: Sequelize.DATE,
      field: 'created_at',
    },
    comments: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'comments',
    },
    purchaseOrderNumber: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'purchase_order_number',
    },
    isAwarded: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      default: false,
      field: 'awarded',
    },
    updatedAt: {
      type: Sequelize.DATE,
      field: 'updated_at',
    },
    additionalData: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'additional_data',
    },
    isDeleted: {
      type: Sequelize.BOOLEAN,
      field: 'is_deleted',
      default: false,
    },
  },
  {
    timestamps: true,
    tableName: 'quotation_responses',
    indexes: [
      { fields: ['quotation_request_id', 'supplier_id'], unique: true },
    ],
  },
);

module.exports = {
  QuotationsResponse,
};
