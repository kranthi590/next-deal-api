const Sequelize = require('sequelize');
const { SUPPLIER_STATUS } = require('../constants');
const { getConnection } = require('../mysql');

const Suppliers = getConnection().define(
  'suppliers',
  {
    buyerId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'buyer_id',
      foreignKey: true,
      references: {
        model: 'buyers',
        key: 'id',
      },
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: SUPPLIER_STATUS.ACTIVE,
      field: 'status',
    },
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
    webSiteUrl: {
      type: Sequelize.STRING,
      field: 'web_site_url',
    },
    logoUrl: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'logo_url',
    },
    isShared: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_shared',
    },
    emailId: {
      type: Sequelize.UUID,
      isEmail: true,
      allowNull: false,
      field: 'email_id',
      unique: true,
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
      allowNull: true,
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
    createdAt: {
      type: Sequelize.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: Sequelize.DATE,
      field: 'updated_at',
    },
    comments: {
      type: Sequelize.TEXT('long'),
      allowNull: true,
      field: 'comments',
    },
  },
  {
    timestamps: true,
    tableName: 'suppliers',
  },
);

module.exports = {
  Suppliers,
};
