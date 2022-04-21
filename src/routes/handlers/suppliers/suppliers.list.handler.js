const logger = require('../../../helpers/logger');

const { Suppliers } = require('../../../helpers/db.models');
const { InternalServerErrorResponse, OkResponse } = require('../../../helpers/response.transforms');
const { initPagination } = require('../../../helpers/init.pagination');

const getSuppliersHandler = async (req, res) => {
  let response;
  try {
    const {
      limit,
      offset,
    } = initPagination(req);
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
