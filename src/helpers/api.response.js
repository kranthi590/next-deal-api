const responseBuilder = (status, message = '', data = {}) => ({
  status,
  message,
  data,
});

module.exports = responseBuilder;
