const Sequelize = require('sequelize');
const { getConnection } = require('../mysql');

const Buyers = getConnection().define(
  'buyers',
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
      unique: true,
      isAlphanumeric: true,
    },
    status: {
      type: Sequelize.STRING,
      field: 'status',
      allowNull: false,
      isIn: ['suspended', 'active', 'inactive'],
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
      allowNull: true,
      field: 'contact_info_id',
      foreignKey: true,
      references: {
        model: 'business_addresses',
        key: 'id',
      },
    },
  },
  {
    timestamps: false, tableName: 'buyers',
  },
);

module.exports = {
  Buyers,
};
