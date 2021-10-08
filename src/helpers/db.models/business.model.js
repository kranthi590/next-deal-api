const Sequelize = require('sequelize');
const { getConnection } = require('../mysql');

const Business = getConnection().define('business', {
  contact_info_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    notEmpty: true,
  },
  business_type: {
    type: Sequelize.STRING,
    validate: {
      notIn: [['buyer', 'supplier']],
    },
    notEmpty: true,
    allowNull: false,
  },
  role_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    isInt: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    notEmpty: true,
  },
  fantasy_name: {
    type: Sequelize.STRING,
    allowNull: false,
    notEmpty: true,
  },
  rut: {
    type: Sequelize.STRING,
    allowNull: false,
    notEmpty: true,
  },
  web_site_url: {
    type: Sequelize.STRING,
    allowNull: false,
    notEmpty: true,
  },
  service_location: {
    type: Sequelize.STRING,
    allowNull: false,
    notEmpty: true,
  },
  subdomain_name: {
    type: Sequelize.STRING,
    allowNull: false,
    notEmpty: true,
  },
  email_id: {
    type: Sequelize.STRING,
    unique: true,
    validate: {
      isEmail: true,
    },
    allowNull: false,
    notEmpty: true,
  },
  is_active: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  licensed_until: {
    type: Sequelize.DATE,
    allowNull: false,
    notEmpty: true,
  },
  additional_data: Sequelize.STRING,
}, { timestamps: true });

module.exports = {
  Business,
};
