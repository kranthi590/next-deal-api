const jwt = require('jsonwebtoken');
const { INVALID_JWT_TOKEN } = require('../helpers/constants');
const { ForbiddenResponse } = require('../helpers/response.transforms');

const verifyToken = (req, res, next) => {
  try {
    const decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET_KEY);
    req.user = decoded;
  } catch (err) {
    const resp = ForbiddenResponse(INVALID_JWT_TOKEN, req.traceId);
    return res.status(resp.status).json(resp);
  }
  return next();
};

module.exports = verifyToken;
