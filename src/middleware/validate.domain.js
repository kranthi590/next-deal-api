const { INVALID_JWT_TOKEN, INVALID_DOMAIN } = require('../helpers/constants');
const { getSubDomainFromRequest } = require('../helpers/get.subdomain');
const { ForbiddenResponse } = require('../helpers/response.transforms');

const verifyDomain = (req, res, next) => {
  try {
    const subDomain = getSubDomainFromRequest(req);
    if (subDomain === '*') {
      return next();
    }
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
