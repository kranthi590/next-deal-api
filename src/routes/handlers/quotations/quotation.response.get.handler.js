const { INVALID_QUOTATION_RESPONSE_ID } = require('../../../helpers/constants');
const { QuotationsResponse } = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');
const { OkResponse } = require('../../../helpers/response.transforms');

const getQuotationResponseHandler = async (req, res) => {
  let response;
  try {
    const quotation = await QuotationsResponse.findOne({
      where: { id: req.params.quotationResponseId },
    });
    if (!quotation) {
      throw new Error(INVALID_QUOTATION_RESPONSE_ID);
    }
    response = OkResponse(quotation.dataValues, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while fetching quotation response by ID:', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  getQuotationResponseHandler,
};
