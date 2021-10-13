const Sequelize = require('sequelize');
const { getConnection } = require('../mysql');

const Address = getConnection().define(
  'addresses',
  {
    address_line1: Sequelize.STRING,
    address_line2: Sequelize.STRING,
    address_line3: Sequelize.STRING,
    commune_id: Sequelize.INTEGER,
    region_id: Sequelize.INTEGER,
    country_id: Sequelize.INTEGER,
    email_id: {
      type: Sequelize.STRING,
      isEmail: true,
    },
    phone_number1: Sequelize.STRING,
    phone_number2: Sequelize.STRING,
    additional_data: Sequelize.STRING,
  },
  { timestamps: false },
);

const BusinessAddress = getConnection().define(
  'business_address',
  {
    address_line1: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    address_line2: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    address_line3: Sequelize.STRING,
    commune_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    region_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    country_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    email_id: {
      type: Sequelize.INTEGER,
      isEmail: true,
      allowNull: false,
    },
    phone_number1: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phone_number2: Sequelize.STRING,
    additional_data: Sequelize.STRING,
  },
  { timestamps: false },
);

module.exports = {
  Address,
  BusinessAddress,
};
