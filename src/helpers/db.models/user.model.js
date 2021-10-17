const Sequelize = require('sequelize');

module.exports = (sequelize) => ({
  User: sequelize.define(
    'users',
    {
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'first_name',
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'last_name',
      },
      emailId: {
        type: Sequelize.UUID,
        isEmail: true,
        allowNull: false,
        field: 'email_id',
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'password_hash',
      },
      type: {
        type: Sequelize.STRING,
        field: 'type',
        allowNull: false,
        isIn: [['buyer', 'supplier', 'admin']],
      },
      status: {
        type: Sequelize.BOOLEAN,
        field: 'is_active',
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
          model: 'BusinessAddress',
          key: 'id',
        },
      },
      lastLoginDate: {
        type: Sequelize.DATE,
        field: 'last_login_date',
      },
      buyerId: {
        type: Sequelize.INTEGER,
        field: 'buyer_id',
      },
      supplierId: {
        type: Sequelize.INTEGER,
        field: 'supplier_id',
      },
    },
    {
      timestamps: false,
      validate: {
        invalidBuyerId() {
          if (this.type === 'buyer' && !this.buyerId) {
            throw new Error('INVALID_BUYER_ID');
          }
          if (this.type === 'supplier' && !this.supplierId) {
            throw new Error('INVALID_SUPPLIER_ID');
          }
        },
      },
    },
  ),
});