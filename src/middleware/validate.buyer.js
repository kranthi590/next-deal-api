const { BadRequestResponse, ForbiddenResponse } = require('../helpers/response.transforms');
const { getSubDomainFromRequest } = require('../helpers/get.subdomain');
const { Buyers } = require('../helpers/db.models');
const { BUYER_STATUS } = require('../helpers/constants');

const getBuyer = async (subDomain) => {
  const query = {
    where: {
      subDomainName: subDomain,
    },
  };
  return Buyers.findOne(query);
};

const validate = async (req, res, next) => {
  let response;
  try {
    const subDomain = getSubDomainFromRequest(req.get('host'));
    if (!subDomain) {
      response = ForbiddenResponse('INVALID_BUYER', req.traceId);
    } else {
      const buyer = await getBuyer(subDomain.toLowerCase());
      if (!buyer || buyer.status !== BUYER_STATUS.ACTIVE) {
        response = ForbiddenResponse(
          !buyer ? 'INVALID_BUYER' : 'BUYER_ACCOUNT_SUSPENDED',
          req.traceId,
        );
      } else {
        req.buyer = buyer;
        next();
        return;
      }
    }
  } catch (error) {
    response = BadRequestResponse(error.details, req.traceId, 'Validation errors');
  }
  res.status(response.status).json(response);
};

module.exports = validate;
