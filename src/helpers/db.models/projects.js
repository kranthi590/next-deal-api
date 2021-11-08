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
    createdAt: {
      type: Sequelize.DATE,
      field: 'created_at',
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'description',
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
  },
  { timestamps: true, tableName: 'projects' },
);

module.exports = {
  Projects,
};
