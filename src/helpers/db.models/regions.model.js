const Sequelize = require('sequelize');
const { getConnection } = require('../mysql');

const Regions = getConnection().define('regions', {
  name: Sequelize.STRING,
  ordinal: Sequelize.STRING,
  created_at: Sequelize.DATE,
  updated_at: Sequelize.DATE,
}, { timestamps: false });

module.exports = {
  Regions,
};
