const { INVALID_JWT_TOKEN, INVALID_DOMAIN } = require('../helpers/constants');
const { getSubDomainFromRequest } = require('../helpers/get.subdomain');
const logger = require('../helpers/logger');
const { ForbiddenResponse } = require('../helpers/response.transforms');

const verifyDomain = (req, res, next) => {
  try {
    const subDomain = getSubDomainFromRequest(req);
    logger.info(`User: ${JSON.stringify(req.user)}`);
    logger.info(`SubDomain: ${subDomain}`);
    if (req.user && req.user.domain === subDomain) {
      return next();
    }
    const resp = ForbiddenResponse(INVALID_DOMAIN, req.traceId);
    return res.status(resp.status).json(resp);
  } catch (err) {
    const resp = ForbiddenResponse(
      err === INVALID_DOMAIN ? INVALID_DOMAIN : INVALID_JWT_TOKEN,
      req.traceId,
    );
    return res.status(resp.status).json(resp);
  }
};

module.exports = verifyDomain;
