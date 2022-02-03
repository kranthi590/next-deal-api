const logger = require('../../../helpers/logger');

const { Suppliers } = require('../../../helpers/db.models');
const { InternalServerErrorResponse, OkResponse, ForbiddenResponse } = require('../../../helpers/response.transforms');
const { INVALID_BUYER_ID, DB_FETCH_SIZE, DB_OFFSET_DEFAULT } = require('../../../helpers/constants');

const getBuyersSupplierHandler = async (req, res) => {
  let response;
  try {
    if (req.params.buyerId !== req.user.buyerId.toString()) {
      response = ForbiddenResponse(INVALID_BUYER_ID, req.traceId);
    } else {
      const limit = req.query.size ? parseInt(req.query.size, 10) : DB_FETCH_SIZE;
      const offset = req.query.size ? parseInt(req.query.offset, 10) : DB_OFFSET_DEFAULT;
      const query = {
        where: {
          buyerId: req.user.buyerId,
        },
        attributes: ['id', 'legalName', 'fantasyName', 'emailId', 'isShared'],
        limit,
        offset,
      };
      const suppliers = await Suppliers.findAndCountAll(query);
      suppliers.limit = limit;
      suppliers.offset = offset;
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
