const Sequelize = require('sequelize');
const { getConnection } = require('../mysql');

const Countries = getConnection().define(
  'countries',
  {
    name: Sequelize.STRING,
    code: {
      type: Sequelize.STRING,
      unique: true,
    },
    active: Sequelize.BOOLEAN,
    createdAt: {
      type: Sequelize.DATE,
      field: 'created_at',
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: Sequelize.DATE,
      field: 'updated_at',
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    description: Sequelize.STRING,
  },
  { timestamps: true, tableName: 'countries' },
);

const Regions = getConnection().define(
  'regions',
  {
    name: Sequelize.STRING,
    ordinal: Sequelize.STRING,
    createdAt: {
      type: Sequelize.DATE,
      field: 'created_at',
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: Sequelize.DATE,
      field: 'updated_at',
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    orderNum: {
      field: 'order_num',
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    countryId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'country_id',
      foreignKey: true,
      references: {
        model: 'countries',
        key: 'id',
      },
    },
    description: Sequelize.STRING,
  },
  { timestamps: true, tableName: 'regions' },
);

const Comunas = getConnection().define(
  'comunas',
  {
    name: {
      type: Sequelize.STRING,
      unique: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      field: 'created_at',
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    updatedAt: {
      type: Sequelize.DATE,
      field: 'updated_at',
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
    regionId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'region_id',
      foreignKey: true,
      references: {
        model: 'regions',
        key: 'id',
      },
    },
  },
  { timestamps: true, tableName: 'comunas' },
);

module.exports = {
  Comunas,
  Countries,
  Regions,
};
