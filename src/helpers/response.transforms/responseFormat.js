const { invalidStatusCode, invalidTraceId } = require('../thrownErrors');

function formatResponse({
  status, message = '', data = {}, id, errors,
}) {
  const responseFormatDefaults = {
    data: {},
    message: '',
  };
  if (!status) {
    throw new Error(invalidStatusCode);
  }
  if (!id || id.length === 0) {
    throw new Error(invalidTraceId);
  }

  const response = {
    ...responseFormatDefaults,
    status,
    message,
    data,
    id,
    errors,
  };

  return response;
}

module.exports = {
  formatResponse,
};
