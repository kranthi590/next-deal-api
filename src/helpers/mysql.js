const mysql = require('mysql2');
const SQL = require('@nearform/sql');

const logger = require('./logger');

let connection;

// eslint-disable-next-line consistent-return
const init = () => new Promise((resolve) => {
  const {
    MYSQL_HOST,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_DB,
    NODE_ENV,
  } = process.env;
  connection = mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: `${MYSQL_DB}_${NODE_ENV}`,
  });
  connection.connect((err) => {
    if (err) {
      logger.error('Error while connecting to database', err);
      resolve(false);
    } else {
      logger.info('Connected to mysql successfully...');
      resolve(true);
    }
  });
});

const closeConnection = () => {
  connection.end();
};

const executeQuery = (query) => new Promise((resolve, reject) => {
  const sql = SQL`${query}`;
  connection.query(sql, (error, results) => {
    if (error) {
      reject(error);
    } else {
      resolve(results);
    }
  });
});

module.exports = { init, closeConnection, executeQuery };
