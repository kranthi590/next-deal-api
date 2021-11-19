const logger = require('../../../helpers/logger');

const { Buyers } = require('../../../helpers/db.models');
const { InternalServerErrorResponse, OkResponse, UnauthorizedResponse } = require('../../../helpers/response.transforms');
const { INVALID_BUYER_ID } = require('../../../helpers/constants');

const getBuyer = async (buyerId) => {
  const query = {
    include: ['businessAddress'],
    where: {
      id: buyerId,
    },
  };
  return Buyers.findOne(query);
};

const getBuyerHandler = async (req, res) => {
  let response;
  try {
    const buyer = await getBuyer(req.params.buyerId);
    if (!buyer) {
      response = UnauthorizedResponse(INVALID_BUYER_ID, req.traceId);
    } else {
      response = OkResponse(buyer, req.traceId);
    }
  } catch (error) {
    response = InternalServerErrorResponse('', req.traceId);
    logger.error('Error while fetching buyer', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  getBuyerHandler,
};
