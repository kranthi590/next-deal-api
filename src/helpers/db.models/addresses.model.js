const Sequelize = require('sequelize');
const { getConnection } = require('../mysql');

const Addresses = getConnection().define(
  'addresses',
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    addressLine1: {
      type: Sequelize.STRING,
      field: 'address_line1',
    },
    addressLine2: {
      type: Sequelize.STRING,
      field: 'address_line2',
    },
    addressLine3: {
      type: Sequelize.STRING,
      field: 'address_line3',
    },
    communeId: {
      type: Sequelize.INTEGER,
      field: 'commune_id',
      foreignKey: true,
      references: {
        model: 'comunas',
        key: 'id',
      },
    },
    regionId: {
      type: Sequelize.INTEGER,
      field: 'region_id',
      foreignKey: true,
      references: {
        model: 'regions',
        key: 'id',
      },
    },
    countryId: {
      type: Sequelize.INTEGER,
      field: 'country_id',
      foreignKey: true,
      references: {
        model: 'countries',
        key: 'id',
      },
    },
    emailId: {
      type: Sequelize.STRING,
      isEmail: true,
      field: 'email_id',
    },
    phoneNumber1: {
      type: Sequelize.STRING,
      field: 'phone_number1',
    },
    phoneNumber2: {
      type: Sequelize.STRING,
      field: 'phone_number2',
    },
    additionalData: {
      type: Sequelize.STRING,
      field: 'additional_data',
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
  { timestamps: true, tableName: 'addresses' },
);

module.exports = {
  Addresses,
};
