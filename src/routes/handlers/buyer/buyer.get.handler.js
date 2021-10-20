const logger = require('../../../helpers/logger');

const { Buyer } = require('../../../helpers/db.models/buyer.model');
const { InternalServerErrorResponse, OkResponse } = require('../../../helpers/response.transforms');

const getBuyer = async (buyerId) => {
  const query = {
    include: ['businessAddress'],
    where: {
      id: buyerId,
    },
  };
  return Buyer.findOne(query);
};

const getBuyerHandler = async (req, res) => {
  let response;
  try {
    const buyer = await getBuyer(req.params.buyerId);
    response = OkResponse(buyer, req.traceId);
  } catch (error) {
    response = InternalServerErrorResponse('', req.traceId);
    logger.error(`Error while fetching buyer ${error}`);
  }
  res.status(response.status).json(response);
};

module.exports = {
  getBuyerHandler,
};
