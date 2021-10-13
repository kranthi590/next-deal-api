const { formatResponse } = require('./responseFormat');

module.exports = (errorCode, id, message = 'Conflict') => formatResponse({
  status: 409,
  message,
  errors: [
    {
      errorCode,
    },
  ],
  id,
});
