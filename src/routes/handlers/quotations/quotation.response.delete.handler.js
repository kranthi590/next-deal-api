const { INVALID_QUOTATION_ID } = require('../../../helpers/constants');
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
      attributes: ['id'],
      include: [{
        model: QuotationsRequest,
        as: 'quotation',
        attributes: [],
        include: [{
          model: Projects,
          as: 'project',
          attributes: [],
          where: {
            buyerId: req.user.buyerId,
          },
          required: true,
        }],
        required: true,
      }],
    });
    if (!quotationResponse) {
      throw new Error(INVALID_QUOTATION_ID);
    }
    await QuotationsResponse.destroy({
      where: {
        id: req.params.quotationResponseId,
      },
    });
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
