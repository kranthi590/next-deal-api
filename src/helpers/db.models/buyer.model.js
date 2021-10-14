const Sequelize = require('sequelize');
const { getConnection } = require('../mysql');

const Buyer = getConnection().define(
  'buyer',
  {
    rut: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    legalName: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'legal_name',
    },
    fantasyName: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'fantasy_name',
    },
    webSiteUrl: {
      type: Sequelize.STRING,
      field: 'web_site_url',
    },
    emailId: {
      type: Sequelize.UUID,
      isEmail: true,
      allowNull: false,
      field: 'email_id',
    },
    subDomainName: {
      type: Sequelize.STRING,
      field: 'subdomain_name',
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      field: 'status',
      allowNull: false,
      isIn: [['suspended', 'active', 'inactive']],
    },
    licensedUntil: {
      type: Sequelize.DATE,
      field: 'licensed_until',
      allowNull: false,
    },
    additionalData: {
      type: Sequelize.STRING,
      field: 'additional_data',
    },
    contactInfoId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'contact_info_id',
    },
  },
  {
    timestamps: false,
  },
);

module.exports = {
  Buyer,
};
