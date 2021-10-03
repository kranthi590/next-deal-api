const Sequelize = require('sequelize');
const { getConnection } = require('../mysql');

const Regions = getConnection().define('regions', {
  name: Sequelize.STRING,
  ordinal: Sequelize.STRING,
  created_at: Sequelize.DATE,
  updated_at: Sequelize.DATE,
  order_num: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
}, { timestamps: false });

module.exports = {
  Regions,
};
