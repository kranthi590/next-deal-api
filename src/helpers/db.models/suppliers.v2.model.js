const Sequelize = require('sequelize');
const { SUPPLIER_STATUS } = require('../constants');
const { getConnection } = require('../mysql');

const SuppliersV2 = getConnection().define(
  'suppliers',
  {
    // Required Fields
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
    isShared: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'is_shared',
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: SUPPLIER_STATUS.ACTIVE,
      field: 'status',
    },

    // Optional
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
    webSiteUrl: {
      type: Sequelize.STRING,
      field: 'web_site_url',
      allowNull: true,
    },
    logoUrl: {
      type: Sequelize.STRING,
      allowNull: true,
      field: 'logo_url',
    },
    emailId: {
      type: Sequelize.UUID,
      isEmail: true,
      allowNull: true,
      field: 'email_id',
      unique: true,
    },
    inchargeFullName: {
      type: Sequelize.STRING,
      field: 'in_charge_fullname',
      allowNull: true,
    },
    inchargeRole: {
      type: Sequelize.STRING,
      field: 'in_charge_role',
      allowNull: true,
    },
    createdBy: {
      type: Sequelize.INTEGER,
      field: 'created_by',
      allowNull: true,
    },
    additionalData: {
      type: Sequelize.STRING,
      field: 'additional_data',
      allowNull: true,
    },
    businessAddressId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      field: 'business_address_id',
    },
    inChargeAddressId: {
      type: Sequelize.INTEGER,
      field: 'in_charge_address_id',
      allowNull: true,
    },
    billingAddressId: {
      type: Sequelize.INTEGER,
      field: 'billing_address_id',
      allowNull: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      field: 'created_at',
      allowNull: true,
    },
    updatedAt: {
      type: Sequelize.DATE,
      field: 'updated_at',
      allowNull: true,
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
  SuppliersV2,
};
