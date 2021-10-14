const Sequelize = require('sequelize');
const { getConnection } = require('../mysql');

const Address = getConnection().define(
  'addresses',
  {
    addressLine1: {
      type: Sequelize.STRING,
      field: 'address_line1',
    },
    addressLine2: {
      type: Sequelize.STRING,
      field: 'address_line2',
    },
    address_line3: {
      type: Sequelize.STRING,
      field: 'address_line2',
    },
    communeId: {
      type: Sequelize.INTEGER,
      field: 'commune_id',
    },
    regionId: {
      type: Sequelize.INTEGER,
      field: 'region_id',
    },
    countryId: {
      type: Sequelize.INTEGER,
      field: 'country_id',
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
  },
  { timestamps: false },
);

const BusinessAddress = getConnection().define(
  'business_addresses',
  {
    addressLine1: {
      type: Sequelize.STRING,
      field: 'address_line1',
      allowNull: false,
    },
    addressLine2: {
      type: Sequelize.STRING,
      field: 'address_line2',
      allowNull: false,
    },
    address_line3: {
      type: Sequelize.STRING,
      field: 'address_line2',
    },
    communeId: {
      type: Sequelize.INTEGER,
      field: 'commune_id',
      allowNull: false,
    },
    regionId: {
      type: Sequelize.INTEGER,
      field: 'region_id',
      allowNull: false,
    },
    countryId: {
      type: Sequelize.INTEGER,
      field: 'country_id',
      allowNull: false,
    },
    emailId: {
      type: Sequelize.STRING,
      isEmail: true,
      field: 'email_id',
      allowNull: false,
    },
    phoneNumber1: {
      type: Sequelize.STRING,
      field: 'phone_number1',
      allowNull: false,
    },
    phoneNumber2: {
      type: Sequelize.STRING,
      field: 'phone_number2',
    },
    additionalData: {
      type: Sequelize.STRING,
      field: 'additional_data',
    },
  },
  { timestamps: false },
);

module.exports = {
  Address,
  BusinessAddress,
};
