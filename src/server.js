require('dotenv/config');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { v4 } = require('uuid');
const cors = require('cors');

const swaggerDocument = require('./swagger.json');
const { init: initMysql, closeConnection } = require('./helpers/mysql');
const logger = require('./helpers/logger');

const app = express();
app.use(cors({
  origin: '*',
}));
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/', (req, res, next) => {
  const id = v4();
  // traceId is for the ability to track a request without happening to reassign
  // the entire pino logger on every request.
  req.traceId = id;
  next();
});

const init = async () => {
  if (await initMysql()) {
    require('./helpers/db.models');
    const initRoutes = require('./routes');
    initRoutes(app);
    app.listen(port, () => logger.info(`Started server on port ${port}`));
  }
};

process
  .on('unhandledRejection', (reason, p) => {
    logger.error(`${reason} Unhandled Rejection at Promise ${p}`);
  })
  .on('uncaughtException', (err) => {
    logger.error(`${err}Uncaught Exception thrown`);
    closeConnection();
    process.exit(1);
  });

module.exports = init();
