require('dotenv/config');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { v4 } = require('uuid');
const cors = require('cors');

const swaggerDocument = require('./swagger.json');
const { init: initMysql, closeConnection } = require('./helpers/mysql');
const logger = require('./helpers/logger');
const { initStorage } = require('./helpers/bucket.utils');

const app = express();
app.use(
  cors({
    origin: '*',
  }),
);
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/', (req, res, next) => {
  req.traceId = req.headers.trace_id || v4();
  next();
});

const init = async () => {
  const promises = [initMysql(), initStorage()];
  const [isConnectedToMysql, isConnectedToGCPStorage] = await Promise.all(promises);
  if (isConnectedToMysql && isConnectedToGCPStorage) {
    require('./routes')(app);
    app.listen(port, () => logger.info(`Started server on port ${port}`));
  } else {
    process.exit(1);
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
