const Sequelize = require('sequelize');
const { CURRENCY_TYPE, PROJECT_STATUS } = require('../constants');
const { getConnection } = require('../mysql');

const Projects = getConnection().define(
  'projects',
  {
    buyerId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'buyer_id',
      foreignKey: true,
      references: {
        model: 'buyers',
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
    managerName: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'manager_name',
    },
    code: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    startDate: {
      type: Sequelize.DATE,
      allowNull: false,
      field: 'start_date',
    },
    expectedEndDate: {
      type: Sequelize.DATE,
      allowNull: true,
      field: 'expected_end_date',
    },
    actualEndDate: {
      type: Sequelize.DATE,
      allowNull: true,
      field: 'actual_end_date',
    },
    costCenter: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'cost_center',
    },
    currency: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'currency',
      isIn: Object.values(CURRENCY_TYPE),
    },
    estimatedBudget: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'estimated_budget',
    },
    createdAt: {
      type: Sequelize.DATE,
      field: 'created_at',
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'status',
      isIn: Object.values(PROJECT_STATUS),
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
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT('long'),
      allowNull: false,
      field: 'description',
    },
  },
  {
    timestamps: true,
    tableName: 'projects',
    indexes: [
      { fields: ['buyer_id', 'code'], unique: true },
    ],
  },
);

module.exports = {
  Projects,
};
