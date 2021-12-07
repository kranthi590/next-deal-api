const {
  INVALID_QUOTATION_RESPONSE_ID,
  INVALID_BUYER_ID,
  QUOTATION_ALREADY_AWARDED,
  QUOTATION_STATUS,
  ANOTHER_QUOTATION_ALREADY_AWARDED,
} = require('../../../helpers/constants');
const { QuotationsResponse, QuotationsRequest, Projects } = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');
const { getConnection } = require('../../../helpers/mysql');
const { OkResponse } = require('../../../helpers/response.transforms');

const awardQuotation = async (data) => getConnection().transaction(async (t) => {
  const { quotationResponseId, quotationRequestId } = data;
  await QuotationsResponse.update(
    { isAwarded: true },
    {
      where: { id: quotationResponseId },
      transaction: t,
    },
  );
  await QuotationsRequest.update(
    { status: QUOTATION_STATUS.AWARDED },
    {
      where: { id: quotationRequestId },
      transaction: t,
      returning: true,
    },
  );
});

const awardQuotationHandler = async (req, res) => {
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
        attributes: ['id', 'projectId'],
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
    if (req.user.buyerId !== quotation.quotation.project.buyerId) {
      throw new Error(INVALID_BUYER_ID);
    }
    if (quotation.isAwarded) {
      throw new Error(QUOTATION_ALREADY_AWARDED);
    }
    const quotationResponse1 = await QuotationsResponse.findOne({
      where: {
        quotationRequestId: quotation.quotation.id,
        isAwarded: true,
      },
      attributes: ['id', 'isAwarded'],
    });
    if (quotationResponse1) {
      throw new Error(ANOTHER_QUOTATION_ALREADY_AWARDED);
    }
    await awardQuotation({
      quotationResponseId: req.params.quotationResponseId,
      quotationRequestId: quotation.quotation.id,
    });
    response = OkResponse({}, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId, 'quotation_create');
    logger.error('Error while creating quotation request:', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  awardQuotationHandler,
};
