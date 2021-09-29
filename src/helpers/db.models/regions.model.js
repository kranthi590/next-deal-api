const Sequelize = require('sequelize');
const { getConnection } = require('../mysql');

const Regions = getConnection().define('regions', {
  name: Sequelize.STRING,
  ordinal: Sequelize.STRING,
  active: Sequelize.BOOLEAN,
  created_at: Sequelize.DATE,
  updated_at: Sequelize.DATE,
  description: Sequelize.STRING,
}, { timestamps: false });

module.exports = {
  Regions,
};
