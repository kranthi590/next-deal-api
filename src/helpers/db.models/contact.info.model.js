const Sequelize = require('sequelize');
const { getConnection } = require('../mysql');

const ContactInfo = getConnection().define('contact_info', {
  first_name: Sequelize.STRING,
  last_name: Sequelize.STRING,
  role_id: Sequelize.INTEGER,
  address_line1: Sequelize.STRING,
  address_line2: Sequelize.STRING,
  address_line3: Sequelize.STRING,
  commune_id: Sequelize.INTEGER,
  region_id: Sequelize.INTEGER,
  country_id: Sequelize.INTEGER,
  email_id: {
    type: Sequelize.UUID,
    unique: true,
  },
  phone_number1: Sequelize.STRING,
  phone_number2: Sequelize.STRING,
  created_at: Sequelize.DATE,
  updated_at: Sequelize.DATE,
  additional_data: Sequelize.STRING,
}, { timestamps: true });

module.exports = {
  ContactInfo,
};
