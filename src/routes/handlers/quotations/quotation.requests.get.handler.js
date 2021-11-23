const { INVALID_QUOTATION_ID } = require('../../../helpers/constants');
const { QuotationsRequest } = require('../../../helpers/db.models');
const { QuotationToSupplierMappings } = require('../../../helpers/db.models/quotation.supplier.mappings.model');
const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');
const { OkResponse } = require('../../../helpers/response.transforms');

const getQuotationHandler = async (req, res) => {
  let response;
  try {
    const quotation = await QuotationsRequest.findOne({
      where: { id: req.params.quotationRequestId },
      include: [
        {
          model: QuotationToSupplierMappings,
          as: 'suppliersMapping',
        },
      ],
    });
    if (!quotation) {
      throw new Error(INVALID_QUOTATION_ID);
    }
    response = OkResponse(quotation.dataValues, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while fetching quotation by ID:', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  getQuotationHandler,
};
