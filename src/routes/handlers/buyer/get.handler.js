const logger = require('../../../helpers/logger');

const { Buyer } = require('../../../helpers/db.models');
const { InternalServerErrorResponse, OkResponse } = require('../../../helpers/response.transforms');

const getBuyer = async (buyerId) => {
  const query = {
    include: ['businessAddress'],
    where: {
      id: buyerId,
    },
    attributes: {},
    raw: true,
    nest: true,
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
    logger.error(`Error while fetching buyer by id ${error}`);
  }
  res.status(response.status).json(response);
};

module.exports = {
  getBuyerHandler,
};