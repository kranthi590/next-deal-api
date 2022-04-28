const { INVALID_API_KEY } = require('../helpers/constants');
const { ForbiddenResponse } = require('../helpers/response.transforms');
const logger = require('../helpers/logger');

const verifyApiKey = (req, res, next) => {
  try {
    if (req.headers['x-api-key'] !== process.env.API_KEY) {
      throw new Error(INVALID_API_KEY);
    }
    return next();
  } catch (err) {
    logger.error('Error while validating internal token: ', err);
    const resp = ForbiddenResponse(INVALID_API_KEY, req.traceId);
    return res.status(resp.status).json(resp);
  }
};

module.exports = verifyApiKey;
