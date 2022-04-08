require('dotenv/config');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { v4 } = require('uuid');
const cors = require('cors');

const swaggerDocument = require('./swagger.json');
const { init: initMysql, closeConnection } = require('./helpers/mysql');
const logger = require('./helpers/logger');
const { initStorage } = require('./helpers/bucket.utils');
const { OkResponse } = require('./helpers/response.transforms');

const app = express();
app.use(
  cors({
    origin: '*',
  }),
);
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/', (req, res, next) => {
  req.traceId = req.headers.trace_id || v4();
  logger.info(`Invoked service: ${req.originalUrl} with arguments: ${JSON.stringify(req.method === 'GET' ? req.query : req.body)}`);
  next();
});

const init = async () => {
  const promises = [initMysql(), initStorage()];
  const [isConnectedToMysql, isConnectedToGCPStorage] = await Promise.all(promises);
  if (isConnectedToMysql && isConnectedToGCPStorage) {
    const v1Routes = require('./routes/v1');
    const v2Routes = require('./routes/v2');
    app.get(['/', '/health', '/api/v1', '/api/v1/health'], (req, res) => {
      const response = OkResponse(null, req.traceId, 'OK Response');
      res.status(response.status).json(response);
    });
    app.use('/api/v1', v1Routes);
    app.use('/api/v2', v2Routes);
    app.listen(port, () => logger.info(`Started server on port ${port}`));
  } else {
    process.exit(1);
  }
};

process
  .on('unhandledRejection', (reason, p) => {
    logger.error(`${reason} Unhandled Rejection at Promise`, p);
  })
  .on('uncaughtException', (err) => {
    logger.error('Uncaught Exception thrown', err);
    closeConnection();
    process.exit(1);
  });

module.exports = init();
