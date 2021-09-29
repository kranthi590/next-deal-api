const Sequelize = require('sequelize');
const { getConnection } = require('../mysql');

const Countries = getConnection().define('countries', {
  name: Sequelize.STRING,
  code: Sequelize.STRING,
  active: Sequelize.BOOLEAN,
  created_at: Sequelize.DATE,
  updated_at: Sequelize.DATE,
  description: Sequelize.STRING,
}, { timestamps: false });

module.exports = {
  Countries,
};
