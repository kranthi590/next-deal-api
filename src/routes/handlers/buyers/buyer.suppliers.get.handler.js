const logger = require('../../../helpers/logger');

const { Suppliers } = require('../../../helpers/db.models');
const { InternalServerErrorResponse, OkResponse, ForbiddenResponse } = require('../../../helpers/response.transforms');
const { INVALID_BUYER_ID } = require('../../../helpers/constants');

const getBuyersSupplierHandler = async (req, res) => {
  let response;
  try {
    if (req.params.buyerId !== req.user.buyerId.toString()) {
      response = ForbiddenResponse(INVALID_BUYER_ID, req.traceId);
    } else {
      const query = {
        where: {
          buyerId: req.user.buyerId,
        },
        attributes: ['id', 'legalName', 'fantasyName'],
      };
      const suppliers = await Suppliers.findAll(query);
      response = OkResponse(suppliers, req.traceId);
    }
  } catch (error) {
    response = InternalServerErrorResponse('', req.traceId);
    logger.error('Error while fetching buyers supplier', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  getBuyersSupplierHandler,
};
