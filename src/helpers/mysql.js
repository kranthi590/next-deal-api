const { Sequelize } = require('sequelize');
const logger = require('./logger');

let sequelize;

// eslint-disable-next-line consistent-return
const init = async () => {
  try {
    logger.debug('Initialize mysql connection....');
    sequelize = new Sequelize(process.env.MYSQL_CONNECTION, {
      logging: process.env.MYSQL_DEBUG === 'true',
    });
    await sequelize.authenticate();
    const { initModels } = require('./db.models');
    initModels(sequelize);
    logger.info('Connection has been established successfully.');
    return true;
  } catch (error) {
    logger.error(`Unable to connect to the database:${error}`);
    return false;
  }
};

const closeConnection = () => {
  if (sequelize) {
    sequelize.close();
  }
};

const getConnection = () => sequelize;

module.exports = {
  init,
  closeConnection,
  sequelize,
  getConnection,
};
