const { Sequelize } = require('sequelize');
const logger = require('./logger');

let sequelize;

const setConnection = (sequelizeConnection) => {
  sequelize = sequelizeConnection;
};

const init = async () => {
  try {
    logger.debug('Initialize mysql connection....');
    const connection = new Sequelize(process.env.MYSQL_CONNECTION, {
      logging: process.env.MYSQL_DEBUG === 'true',
    });
    await connection.authenticate();
    setConnection(connection);
    require('./db.models');
    await connection.sync({ force: false });
    const { checkAndInsertData } = require('./master.data');
    await checkAndInsertData();
    logger.info('Connection has been established successfully.');
    return true;
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
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
