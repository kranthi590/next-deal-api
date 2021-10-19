const { BadRequestResponse, ForbiddenResponse } = require('../helpers/response.transforms');
const { getSubDomainFromRequest } = require('../helpers/get.subdomain');
const { getBuyerBySubDomain } = require('../routes/handlers/user/user.register.handler');
const { BuyerStatuses } = require('../routes/handlers/buyer/buyer.register.handler');

const validate = async (req, res, next) => {
  let response;
  try {
    const subDomain = getSubDomainFromRequest(req.get('host'));
    if (!subDomain) {
      response = ForbiddenResponse('INVALID_BUYER', req.traceId);
    } else {
      const buyer = await getBuyerBySubDomain(subDomain.toLowerCase());
      if (!buyer || buyer.status !== BuyerStatuses.ACTIVE) {
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
