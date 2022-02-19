const { Sequelize } = require('sequelize');
const {
  DB_FETCH_SIZE, DB_OFFSET_DEFAULT, QUOTATION_STATUS, INVALID_QUOTATION_STATUS,
} = require('../../../helpers/constants');
const { QuotationsRequest, QuotationsResponse, Projects } = require('../../../helpers/db.models');
const { QuotationToSupplierMappings } = require('../../../helpers/db.models/quotation.supplier.mappings.model');
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
      const where = { projectId: req.params.projectId, isDeleted: false };
      if (req.query.status) {
        where.status = req.query.status;
      }
      const limit = req.query.size ? parseInt(req.query.size, 10) : DB_FETCH_SIZE;
      const offset = req.query.size ? parseInt(req.query.offset, 10) : DB_OFFSET_DEFAULT;
      const quotations = await QuotationsRequest.findAndCountAll({
        attributes:
          ['name', 'id', 'status', 'startDate', 'actualEndDate',
            'expectedEndDate', 'additionalData', 'comments',
            [Sequelize.fn('count', Sequelize.fn('DISTINCT', Sequelize.col('suppliersMapping.id'))), 'suppliersCount'],
            [Sequelize.fn('count', Sequelize.fn('DISTINCT', Sequelize.col('quotationResponse.id'))), 'quotationsCount'],
          ],
        where,
        limit,
        offset,
        order: [['updated_at', 'DESC']],
        include: [
          {
            model: QuotationsResponse,
            as: 'quotationResponse',
            attributes: [],
            where: { isDeleted: false },
          },
          {
            model: QuotationToSupplierMappings,
            as: 'suppliersMapping',
            attributes: [],
          },
          {
            model: Projects,
            as: 'project',
            attributes: [],
            where: {
              buyerId: req.user.buyerId,
              isDeleted: false,
            },
            required: true,
          },
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
