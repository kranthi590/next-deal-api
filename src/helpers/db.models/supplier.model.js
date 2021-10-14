const Sequelize = require('sequelize');
const { getConnection } = require('../mysql');

const Supplier = getConnection().define(
  'supplier',
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
    logoUrl: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'logo_url',
    },
    isShared: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_shared',
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
      isIn: [['Emprendedor', 'Pyme']],
    },
    emailId: {
      type: Sequelize.UUID,
      isEmail: true,
      allowNull: false,
      field: 'email_id',
    },
    inchargeFullName: {
      type: Sequelize.STRING,
      field: 'in_charge_fullname',
    },
    inchargeRole: {
      type: Sequelize.STRING,
      field: 'in_charge_role',
    },
    createdBy: {
      type: Sequelize.INTEGER,
      field: 'created_by',
    },
    additionalData: {
      type: Sequelize.STRING,
      field: 'additional_data',
    },
    businessAddressId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: 'business_address_id',
    },
    inChargeAddressId: {
      type: Sequelize.INTEGER,
      field: 'in_charge_address_id',
    },
    billingAddressId: {
      type: Sequelize.INTEGER,
      field: 'billing_address_id',
    },
  },
  {
    timestamps: false,
  },
);

module.exports = {
  Supplier,
};
