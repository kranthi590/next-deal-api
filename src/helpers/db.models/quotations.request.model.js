const Sequelize = require('sequelize');
const { CURRENCY_TYPE, QUOTATION_STATUS } = require('../constants');
const { getConnection } = require('../mysql');

const QuotationsRequest = getConnection().define(
  'quotation_requests',
  {
    projectId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'project_id',
      foreignKey: true,
      references: {
        model: 'projects',
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
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    code: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    startDate: {
      type: Sequelize.DATE,
      allowNull: false,
      field: 'start_date',
    },
    expectedEndDate: {
      type: Sequelize.DATE,
      allowNull: false,
      field: 'expected_end_date',
    },
    actualEndDate: {
      type: Sequelize.DATE,
      allowNull: true,
      field: 'actual_end_date',
    },
    estimatedBudget: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'estimated_budget',
    },
    currency: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'currency',
      isIn: Object.values(CURRENCY_TYPE),
    },
    createdAt: {
      type: Sequelize.DATE,
      field: 'created_at',
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'description',
    },
    comments: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'comments',
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'status',
      isIn: Object.values(QUOTATION_STATUS),
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
  },
  { timestamps: true, tableName: 'quotation_requests' },
);

module.exports = {
  QuotationsRequest,
};