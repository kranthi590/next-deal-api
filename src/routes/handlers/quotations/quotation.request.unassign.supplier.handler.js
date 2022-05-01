const { INVALID_QUOTATION_ID, QUOTATION_STATUS, INVALID_SUPPLIER_ID } = require('../../../helpers/constants');
const { QuotationsRequest, Projects } = require('../../../helpers/db.models');
const { QuotationToSupplierMappings } = require('../../../helpers/db.models/quotation.supplier.mappings.model');
const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');
const { OkResponse } = require('../../../helpers/response.transforms');

const quotationRequestUnassignSuppliersHandler = async (req, res) => {
  let response;
  try {
    const {
      body: {
        suppliers,
      },
    } = req;
    const {
      quotationRequestId,
    } = req.params;
    const quotationRequest = await QuotationsRequest.findOne({
      where: {
        id: req.params.quotationRequestId,
        isDeleted: false,
      },
      include: [
        {
          model: Projects,
          as: 'project',
          attributes: [],
          where: {
            buyerId: req.user.buyerId,
            isDeleted: false,
          },
          required: true,
        },
        {
          model: QuotationToSupplierMappings,
          as: 'suppliersMapping',
          attributes: ['id'],
          where: {
            supplier_id: suppliers,
            quotation_request_id: quotationRequestId,
          },
          required: false,
        },
      ],
    });
    if (!quotationRequest) {
      throw new Error(INVALID_QUOTATION_ID);
    }
    if (
      quotationRequest.status === QUOTATION_STATUS.AWARDED
      || quotationRequest.status === QUOTATION_STATUS.ABORTED
      || quotationRequest.status === QUOTATION_STATUS.COMPLETED
    ) {
      throw new Error(`QUOTATION_ALREADY_${quotationRequest.status.toUpperCase()}`);
    }
    const mappingIds = quotationRequest.suppliersMapping.map(({ dataValues: { id } }) => id);
    if (mappingIds.length === 0 || mappingIds.length !== suppliers.length) {
      throw new Error(INVALID_SUPPLIER_ID);
    }
    await QuotationToSupplierMappings.destroy({
      where: {
        id: mappingIds,
      },
    });
    response = OkResponse({}, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId, 'quotation_supplier_add');
    logger.error('Error while unassign suppliers from quotation request:', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  quotationRequestUnassignSuppliersHandler,
};
