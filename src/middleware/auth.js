const jwt = require('jsonwebtoken');

const { INVALID_JWT_TOKEN } = require('../helpers/constants');
const { ForbiddenResponse } = require('../helpers/response.transforms');
const logger = require('../helpers/logger');

const verifyToken = (req, res, next) => {
  try {
    const decoded = jwt.verify(
      req.headers.authorization || req.query.token,
      process.env.JWT_SECRET_KEY,
    );
    req.user = decoded;
    return next();
  } catch (err) {
    logger.error('Error while validating token: ', err);
    const resp = ForbiddenResponse(INVALID_JWT_TOKEN, req.traceId);
    return res.status(resp.status).json(resp);
  }
};

module.exports = verifyToken;
