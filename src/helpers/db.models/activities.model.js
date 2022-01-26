const Sequelize = require('sequelize');
const { getConnection } = require('../mysql');

const Activities = getConnection().define(
  'activities',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
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
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'created_by',
      foreignKey: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
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
    activityType: {
      type: Sequelize.STRING,
      field: 'activity_type',
      allowNull: false,
    },
    activityText: {
      type: Sequelize.STRING,
      field: 'activity_text',
    },
    createdAt: {
      type: Sequelize.DATE,
      field: 'created_at',
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: Sequelize.DATE,
      field: 'updated_at',
      defaultValue: Sequelize.NOW,
    },
  },
  { timestamps: false, tableName: 'activities' },
);

module.exports = {
  Activities,
};
