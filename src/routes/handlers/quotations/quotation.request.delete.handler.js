const { INVALID_QUOTATION_ID, QUOTATION_NOT_MAPPED_TO_THIS_BUYER, QUOTATION_ALREADY_DELETED } = require('../../../helpers/constants');
const { QuotationsRequest } = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');
const { OkResponse } = require('../../../helpers/response.transforms');

const deleteQuotationHandler = async (req, res) => {
  let response;
  try {
    const quotation = await QuotationsRequest.findOne({
      where: {
        id: req.params.quotationRequestId,
        //  isDeleted: false,
      },
      include: ['project'],
    });
    if (!quotation) {
      throw new Error(INVALID_QUOTATION_ID);
    }
    const {
      id,
      project: {
        buyerId,
        id: projectId,
      },
      isDeleted,
    } = quotation.toJSON();
    if (isDeleted) {
      throw new Error(QUOTATION_ALREADY_DELETED);
    }
    if (req.user.buyerId !== buyerId) {
      throw new Error(QUOTATION_NOT_MAPPED_TO_THIS_BUYER);
    }
    await QuotationsRequest.update(
      { isDeleted: true },
      {
        where: {
          id,
          projectId,
        },
        returning: true,
      },
    );
    response = OkResponse({}, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while deleting quotation by ID:', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  deleteQuotationHandler,
};
