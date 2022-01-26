const {
  QUOTATION_STATUS,
  QUOTATION_ALREADY_AWARDED,
  INVALID_QUOTATION_ID,
  QUOTATION_ALREADY_COMPLETED,
  QUOTATION_ALREADY_ABORTED,
  ACTIVITIES_TYPES,
} = require('../../../helpers/constants');
const { QuotationsRequest, Activities } = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');
const { getConnection } = require('../../../helpers/mysql');
const { OkResponse } = require('../../../helpers/response.transforms');

const abortQuotation = async (data) => getConnection().transaction(async (t) => {
  const { quotationRequestId, user, projectId } = data;
  await QuotationsRequest.update(
    { status: QUOTATION_STATUS.ABORTED },
    {
      where: { id: quotationRequestId },
      transaction: t,
      returning: true,
    },
  );
  await Activities.create({
    projectId,
    quotationRequestId,
    userId: user.userId,
    buyerId: user.buyerId,
    activityType: ACTIVITIES_TYPES.QUOTATION_ABORTED,
  }, {
    transaction: t,
  });
});

const abortQuotationHandler = async (req, res) => {
  let response;
  try {
    const { quotationRequestId } = req.params;
    const quotationRequest = await QuotationsRequest.findOne({
      where: {
        id: quotationRequestId,
      },
    });
    if (!quotationRequest) {
      throw new Error(INVALID_QUOTATION_ID);
    }
    if (quotationRequest.status === QUOTATION_STATUS.AWARDED) {
      throw new Error(QUOTATION_ALREADY_AWARDED);
    }
    if (quotationRequest.status === QUOTATION_STATUS.COMPLETED) {
      throw new Error(QUOTATION_ALREADY_COMPLETED);
    }
    if (quotationRequest.status === QUOTATION_STATUS.ABORTED) {
      throw new Error(QUOTATION_ALREADY_ABORTED);
    }
    await abortQuotation({
      quotationRequestId,
      user: req.user,
      projectId: quotationRequest.projectId,
    });
    response = OkResponse({}, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while abort quotation:', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  abortQuotationHandler,
};
