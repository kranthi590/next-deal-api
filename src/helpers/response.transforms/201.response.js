const { formatResponse } = require('./responseFormat');

module.exports = (data, id, message = 'Resource Created') => formatResponse({
  status: 201,
  message,
  data,
  id,
});
