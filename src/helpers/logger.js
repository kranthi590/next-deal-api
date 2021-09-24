const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

const formatConfig = format.combine(
  format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }), format.json(),
);

const transportsList = [];
if (process.env.LOG_USE_FILE_TRANSPORTER === 'true') {
  // transportsList.push(new transports.File({
  //   filename: 'logs/server.log',
  //   format: formatConfig,
  // }));
  transportsList.push(new transports.DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  }));
}

if (process.env.LOG_USE_CONSOLE_TRANSPORTER === 'true') {
  transportsList.push(new transports.Console({
    format: formatConfig,
  }));
}

module.exports = createLogger({
  transports: transportsList,
});
