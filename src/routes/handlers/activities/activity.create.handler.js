const { QUOTATION_NOT_FOUND, ACTIVITIES_TYPES } = require('../../../helpers/constants');
const { QuotationsRequest, Activities } = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');
const { OkResponse } = require('../../../helpers/response.transforms');

const getQuotationRequest = async (quotationRequestId) => QuotationsRequest.findOne({
  where: { id: quotationRequestId },
  //  include: ['project'],
});

const createCustomActivityHandler = async (req, res) => {
  let response;
  try {
    const {
      activityText,
      quotationRequestId,
    } = req.body;
    const quotation = await getQuotationRequest(quotationRequestId);
    if (!quotation) {
      throw new Error(QUOTATION_NOT_FOUND);
    }
    const {
      id,
      projectId,
    } = quotation.toJSON();
    const {
      userId,
      buyerId,
    } = req.user;
    await Activities.create({
      projectId,
      quotationRequestId: id,
      userId,
      buyerId,
      activityType: ACTIVITIES_TYPES.CUSTOM,
      activityText,
    });
    response = OkResponse({}, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while creating custom activity:', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  createCustomActivityHandler,
};
