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
    legal_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    fantasy_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    web_site_url: Sequelize.STRING,
    logo_url: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    is_shared: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
      isIn: [['Emprendedor', 'Pyme']],
    },
    email_id: {
      type: Sequelize.UUID,
      isEmail: true,
      allowNull: false,
    },
    in_charge_fullname: Sequelize.STRING,
    in_charge_role: Sequelize.STRING,
    created_by: Sequelize.INTEGER,
    additional_data: Sequelize.STRING,
    business_address_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    in_charge_address_id: {
      type: Sequelize.INTEGER,
    },
    billing_address_id: {
      type: Sequelize.INTEGER,
    },
  },
  {
    timestamps: false,
  },
);

module.exports = {
  Supplier,
};
