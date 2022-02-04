const { INVALID_QUOTATION_ID, QUOTATION_NOT_MAPPED_TO_THIS_BUYER, QUOTATION_ALREADY_DELETED } = require('../../../helpers/constants');
const { QuotationsRequest, QuotationsResponse, Projects } = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');
const { OkResponse } = require('../../../helpers/response.transforms');

const deleteQuotationResponseHandler = async (req, res) => {
  let response;
  try {
    const quotationResponse = await QuotationsResponse.findOne({
      where: {
        id: req.params.quotationResponseId,
      },
      attributes: ['id', 'isDeleted'],
      include: [{
        model: QuotationsRequest,
        as: 'quotation',
        attributes: ['id'],
        include: [{
          model: Projects,
          as: 'project',
          attributes: ['buyerId'],
        }],
      }],
    });
    if (!quotationResponse) {
      throw new Error(INVALID_QUOTATION_ID);
    }
    const {
      id,
      isDeleted,
      quotation: {
        id: quotationRequestId,
        project: {
          buyerId,
        },
      },
    } = quotationResponse.toJSON();
    if (isDeleted) {
      throw new Error(QUOTATION_ALREADY_DELETED);
    }
    if (req.user.buyerId !== buyerId) {
      throw new Error(QUOTATION_NOT_MAPPED_TO_THIS_BUYER);
    }
    await QuotationsResponse.update(
      { isDeleted: true },
      {
        where: {
          id,
          quotationRequestId,
        },
        returning: true,
      },
    );
    response = OkResponse({}, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while deleting quotation response by ID:', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  deleteQuotationResponseHandler,
};
