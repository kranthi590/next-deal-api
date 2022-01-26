const { DB_FETCH_SIZE, DB_OFFSET_DEFAULT } = require('../../../helpers/constants');
const { QuotationsResponse, Suppliers } = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');
const { OkResponse } = require('../../../helpers/response.transforms');

const quotationResponsesListHandler = async (req, res) => {
  let response;
  try {
    const limit = req.query.size ? parseInt(req.query.size, 10) : DB_FETCH_SIZE;
    const offset = req.query.size ? parseInt(req.query.offset, 10) : DB_OFFSET_DEFAULT;
    const quotations = await QuotationsResponse.findAndCountAll({
      where: {
        quotationRequestId: req.params.quotationRequestId,
        isDeleted: false,
      },
      limit,
      offset,
      attributes: [
        'id', 'netWorth', 'paymentCondition', 'includesTax', 'incoterm',
        'deliveryDate', 'validityDate', 'additionalData', 'isAwarded', 'comments',
      ],
      order: [['updated_at', 'DESC']],
      include: [{
        model: Suppliers,
        as: 'supplier',
        attributes: ['id', 'fantasyName'],
      }],
    });
    quotations.limit = limit;
    quotations.offset = offset;
    response = OkResponse(quotations, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while fetching quotation responses', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  quotationResponsesListHandler,
};
