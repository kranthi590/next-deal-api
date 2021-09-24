require('dotenv/config');
const express = require('express');
const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('./swagger.json');
const initRoutes = require('./routes');
const logger = require('./helpers/logger');
const { init: initMysql, closeConnection } = require('./helpers/mysql');

const app = express();
const port = process.env.PORT;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
initRoutes(app);

const init = async () => {
  if (await initMysql()) {
    app.listen(port, () => logger.info(`Started server on port ${port}`));
  }
};

process
  .on('unhandledRejection', (reason, p) => {
    logger.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', (err) => {
    logger.error(err, 'Uncaught Exception thrown');
    closeConnection();
    process.exit(1);
  });

module.exports = init();
