const {
  INVALID_QUOTATION_RESPONSE_ID,
  INVALID_BUYER_ID, QUOTATION_STATUS,
  QUOTATION_ALREADY_COMPLETED, QUOTATION_NOT_AWARDED,
} = require('../../../helpers/constants');
const { QuotationsResponse, QuotationsRequest, Projects } = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');
const { getConnection } = require('../../../helpers/mysql');
const { OkResponse } = require('../../../helpers/response.transforms');

const completeQuotation = async (data) => getConnection().transaction(async (t) => {
  const { quotationResponseId, quotationRequestId, purchaseOrderNumber } = data;
  await QuotationsResponse.update(
    { purchaseOrderNumber },
    {
      where: { id: quotationResponseId },
      transaction: t,
    },
  );
  await QuotationsRequest.update(
    { status: QUOTATION_STATUS.COMPLETED },
    {
      where: { id: quotationRequestId },
      transaction: t,
    },
  );
});

const completeQuotationHandler = async (req, res) => {
  let response;
  try {
    const quotationResponse = await QuotationsResponse.findOne({
      where: {
        id: req.params.quotationResponseId,
      },
      attributes: ['id', 'isAwarded'],
      include: [{
        model: QuotationsRequest,
        as: 'quotation',
        attributes: ['id', 'projectId', 'status'],
        include: [{
          model: Projects,
          as: 'project',
          attributes: ['id', 'buyerId'],
        }],
      }],
    });
    if (!quotationResponse) {
      throw new Error(INVALID_QUOTATION_RESPONSE_ID);
    }
    const quotation = quotationResponse.toJSON();
    console.log(quotation);
    if (req.user.buyerId !== quotation.quotation.project.buyerId) {
      throw new Error(INVALID_BUYER_ID);
    }
    if (!quotation.isAwarded) {
      throw new Error(QUOTATION_NOT_AWARDED);
    }
    if (quotation.quotation.status === QUOTATION_STATUS.COMPLETED) {
      throw new Error(QUOTATION_ALREADY_COMPLETED);
    }
    await completeQuotation({
      quotationResponseId: req.params.quotationResponseId,
      quotationRequestId: quotation.quotation.id,
    });
    response = OkResponse(null, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId, 'quotation_create');
    logger.error('Error while creating quotation request:', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  completeQuotationHandler,
};