const logger = require('../../../helpers/logger');

const { Suppliers } = require('../../../helpers/db.models');
const { InternalServerErrorResponse, OkResponse } = require('../../../helpers/response.transforms');
const { DB_FETCH_SIZE, DB_OFFSET_DEFAULT } = require('../../../helpers/constants');

const getSuppliersHandler = async (req, res) => {
  let response;
  try {
    const limit = req.query.size ? parseInt(req.query.size, 10) : DB_FETCH_SIZE;
    const offset = req.query.size ? parseInt(req.query.offset, 10) : DB_OFFSET_DEFAULT;
    const query = {
      where: {
        isShared: true,
      },
      attributes: ['id', 'legalName', 'emailId', 'isShared'],
      limit,
      offset,
    };
    const suppliers = await Suppliers.findAndCountAll(query);
    suppliers.limit = limit;
    suppliers.offset = offset;
    response = OkResponse(suppliers, req.traceId);
  } catch (error) {
    response = InternalServerErrorResponse('', req.traceId);
    logger.error('Error while fetching supplier', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  getSuppliersHandler,
};
