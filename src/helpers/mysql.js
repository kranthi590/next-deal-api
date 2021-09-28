const mysql = require('mysql2');

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
      console.error('Error while connecting to database', err);
      resolve(false);
    } else {
      console.log('Connected to mysql successfully...');
      resolve(true);
    }
  });
});

const closeConnection = () => {
  connection.end();
};

module.exports = { init, closeConnection };
