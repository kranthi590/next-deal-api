const { Sequelize } = require('sequelize');
const {
  DB_FETCH_SIZE, DB_OFFSET_DEFAULT, QUOTATION_STATUS, INVALID_QUOTATION_STATUS,
} = require('../../../helpers/constants');
const { QuotationsRequest, QuotationsResponse } = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');
const { OkResponse, BadRequestResponse } = require('../../../helpers/response.transforms');

const quotationsListHandler = async (req, res) => {
  let response;
  try {
    if (req.query.status && !Object.values(QUOTATION_STATUS).includes(req.query.status)) {
      response = BadRequestResponse({
        errorCode: INVALID_QUOTATION_STATUS,
      }, req.traceId, 'Validation errors');
    } else {
      const where = { projectId: req.params.projectId };
      if (req.query.status) {
        where.status = req.query.status;
      }
      const limit = req.query.size ? parseInt(req.query.size, 10) : DB_FETCH_SIZE;
      const offset = req.query.size ? parseInt(req.query.offset, 10) : DB_OFFSET_DEFAULT;
      const quotations = await QuotationsRequest.findAndCountAll({
        attributes: ['name', 'id', 'status', 'startDate', 'actualEndDate', 'expectedEndDate', 'additionalData',
          [Sequelize.fn('COUNT', Sequelize.col('quotation_responses.id')), 'quotationsCount'],
        ],
        where,
        limit,
        offset,
        order: [['updated_at', 'DESC']],
        include: [
          {
            model: QuotationsResponse,
            attributes: [],
          },
          'suppliers',
        ],
        group: ['quotation_requests.id'],
        subQuery: false,
      });
      quotations.limit = limit;
      quotations.offset = offset;
      quotations.count = quotations.count.length;
      response = OkResponse(quotations, req.traceId);
    }
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while fetching quotations', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  quotationsListHandler,
};
