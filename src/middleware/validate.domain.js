const { INVALID_DOMAIN } = require('../helpers/constants');
const { getSubDomainFromRequest } = require('../helpers/get.subdomain');
const logger = require('../helpers/logger');
const { ForbiddenResponse } = require('../helpers/response.transforms');

const verifyDomain = (req, res, next) => {
  try {
    const subDomain = getSubDomainFromRequest(req);
    if (req.user && req.user.domain === subDomain) {
      return next();
    }
    const resp = ForbiddenResponse(INVALID_DOMAIN, req.traceId);
    return res.status(resp.status).json(resp);
  } catch (err) {
    logger.error('Error while validating domain', err);
    const resp = ForbiddenResponse(INVALID_DOMAIN, req.traceId);
    return res.status(resp.status).json(resp);
  }
};

module.exports = verifyDomain;
