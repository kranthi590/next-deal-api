const { QuotationsResponse } = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');
const { OkResponse } = require('../../../helpers/response.transforms');

const quotationResponseCreationHandler = async (req, res) => {
  let response;
  try {
    const {
      supplierId,
      netWorth,
      currency,
      includesTax,
      incoterm,
      paymentCondition,
      deliveryDate,
      validityDate,
      description,
      comments,
    } = req.body;
    const {
      projectId,
      quotationRequestId,
    } = req.params;
    const quotation = await QuotationsResponse.create({
      supplierId,
      netWorth,
      currency,
      includesTax,
      incoterm,
      paymentCondition,
      deliveryDate,
      validityDate,
      description,
      comments,
      projectId,
      quotationRequestId,
      createdBy: req.user.userId,
      isAwarded: false,
    });
    response = OkResponse(quotation, req.traceId);
    response = OkResponse(null, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while creating quotation response:', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  quotationResponseCreationHandler,
};
