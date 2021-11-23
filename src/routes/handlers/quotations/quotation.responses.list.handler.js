const { QuotationsResponse } = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');
const { OkResponse } = require('../../../helpers/response.transforms');

const quotationResponsesListHandler = async (req, res) => {
  let response;
  try {
    const quotations = await QuotationsResponse.findAll({
      where: {
        quotationRequestId: req.params.quotationRequestId,
      },
      attributes: ['id', 'netWorth', 'paymentCondition', 'includesTax', 'incoterm', 'deliveryDate', 'validityDate', 'additionalData'],
      order: [['updated_at', 'DESC']],
      // include: [
      //   {
      //     model: Suppliers,
      //     as: 'supplier',
      //     attributes: ['id', 'legalName', 'fantasyName'],
      //   },
      //   {
      //     model: QuotationToSupplierMappings,
      //     as: 'quotation_mapping',
      //   },
      // ],
    });
    response = OkResponse(quotations, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while fetching quotation responses', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  quotationResponsesListHandler,
};
