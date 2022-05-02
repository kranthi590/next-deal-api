const { INVALID_QUOTATION_ID, QUOTATION_STATUS, QUOTATION_ALREADY_AWARDED } = require('../../../helpers/constants');
const { QuotationsRequest, QuotationsResponse, Projects } = require('../../../helpers/db.models');
const { QuotationToSupplierMappings } = require('../../../helpers/db.models/quotation.supplier.mappings.model');
const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');
const { OkResponse } = require('../../../helpers/response.transforms');

const deleteResponseAndUnassignSupplier = async ({
  id, supplierId, quotationRequestId,
}) => {
  await QuotationsResponse.destroy({
    where: {
      id,
    },
  });
  await QuotationToSupplierMappings.destroy({
    where: {
      quotation_request_id: quotationRequestId,
      supplier_id: supplierId,
    },
  });
};

const deleteQuotationResponseHandler = async (req, res) => {
  let response;
  try {
    const quotationResponse = await QuotationsResponse.findOne({
      where: {
        id: req.params.quotationResponseId,
      },
      attributes: ['id', 'supplierId', 'quotationRequestId', 'isAwarded'],
      include: [{
        model: QuotationsRequest,
        as: 'quotation',
        attributes: ['status'],
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
    const {
      id,
      supplierId,
      quotationRequestId,
      quotation: { status },
      isAwarded,
    } = quotationResponse.toJSON();
    if (
      status === QUOTATION_STATUS.AWARDED
      || status === QUOTATION_STATUS.ABORTED
      || status === QUOTATION_STATUS.COMPLETED
    ) {
      throw new Error(`QUOTATION_ALREADY_${status.toUpperCase()}`);
    }
    if (isAwarded) {
      throw new Error(QUOTATION_ALREADY_AWARDED);
    }
    await deleteResponseAndUnassignSupplier({
      id,
      supplierId,
      quotationRequestId,
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
