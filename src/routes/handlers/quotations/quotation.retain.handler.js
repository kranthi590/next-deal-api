const {
  INVALID_QUOTATION_RESPONSE_ID,
  INVALID_BUYER_ID,
  QUOTATION_STATUS,
  QUOTATION_NOT_AWARDED,
  ACTIVITIES_TYPES,
} = require('../../../helpers/constants');
const {
  QuotationsResponse, QuotationsRequest, Projects, Activities,
} = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');
const { getConnection } = require('../../../helpers/mysql');
const { OkResponse } = require('../../../helpers/response.transforms');

const retainQuotation = async (data) => getConnection().transaction(async (t) => {
  const { quotationResponseId, quotationRequestId } = data;
  await QuotationsResponse.update(
    { isAwarded: false },
    {
      where: { id: quotationResponseId },
      transaction: t,
    },
  );
  await QuotationsRequest.update(
    { status: QUOTATION_STATUS.IN_PROGRESS },
    {
      where: { id: quotationRequestId },
      transaction: t,
      returning: true,
    },
  );
  await Activities.create({
    projectId: data.projectId,
    quotationRequestId,
    userId: data.userId,
    buyerId: data.buyerId,
    activityType: ACTIVITIES_TYPES.QUOTATION_RETAINED,
  }, {
    transaction: t,
  });
});

const retainQuotationHandler = async (req, res) => {
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
    if (!quotation.isAwarded) {
      throw new Error(QUOTATION_NOT_AWARDED);
    }
    await retainQuotation({
      quotationResponseId: req.params.quotationResponseId,
      quotationRequestId: quotation.quotation.id,
      projectId: quotation.quotation.project.id,
      buyerId: quotation.quotation.project.buyerId,
      userId: req.user.userId,
    });
    response = OkResponse({}, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId, 'quotation_create');
    logger.error('Error while retain quotation:', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  retainQuotationHandler,
};
