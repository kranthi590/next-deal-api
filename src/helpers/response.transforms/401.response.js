const { formatResponse } = require('./responseFormat');

module.exports = (data, id, message = 'Unauthorized') => formatResponse({
  status: 401,
  message,
  data,
  id,
});
