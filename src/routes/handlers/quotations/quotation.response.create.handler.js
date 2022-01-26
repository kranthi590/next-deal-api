const { ACTIVITIES_TYPES } = require('../../../helpers/constants');
const { QuotationsResponse, Activities, QuotationsRequest } = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');
const { getConnection } = require('../../../helpers/mysql');
const { OkResponse } = require('../../../helpers/response.transforms');

const createQuotationResponse = async (data) => getConnection().transaction(async (t) => {
  const quotation = await QuotationsResponse.create(data, {
    transaction: t,
  });
  await Activities.create({
    projectId: data.projectId,
    quotationRequestId: data.quotationRequestId,
    userId: data.createdBy,
    buyerId: data.buyerId,
    activityType: ACTIVITIES_TYPES.QUOTATION_RESPONSE_CREATED,
  }, {
    transaction: t,
  });
  return quotation;
});

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
      comments,
    } = req.body;
    const {
      quotationRequestId,
    } = req.params;
    const quotationRequest = await QuotationsRequest.findOne({
      where: { id: quotationRequestId, isDeleted: false },
    });
    const quotation = await createQuotationResponse({
      supplierId,
      netWorth,
      currency,
      includesTax,
      incoterm,
      paymentCondition,
      deliveryDate,
      validityDate,
      comments,
      quotationRequestId: quotationRequest.id,
      createdBy: req.user.userId,
      isAwarded: false,
      buyerId: req.user.buyerId,
      projectId: quotationRequest.projectId,
    });
    response = OkResponse(quotation, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while creating quotation response:', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  quotationResponseCreationHandler,
};
