const { Op } = require('sequelize');
const { QuotationsResponse, Suppliers } = require('../../../helpers/db.models');
const { QuotationToSupplierMappings } = require('../../../helpers/db.models/quotation.supplier.mappings.model');
const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');
const { OkResponse } = require('../../../helpers/response.transforms');

const getQuotationAssignedForResponseHandler = async (req, res) => {
  let response;
  try {
    const quotationsResponses = await QuotationsResponse.findAndCountAll({
      where: {
        quotationRequestId: req.params.quotationRequestId,
      },
      attributes: ['supplierId'],
    });
    // eslint-disable-next-line max-len
    const suppliers = quotationsResponses.rows.map((quotationsResponse) => quotationsResponse.dataValues.supplierId);
    const quotations = await QuotationToSupplierMappings.findAll({
      where: {
        [Op.and]: [{
          quotation_request_id: req.params.quotationRequestId,
        }, {
          supplier_id: {
            [Op.notIn]: suppliers,
          },
        },
        ],
      },
      include: [{
        model: Suppliers,
        as: 'supplier',
        attributes: ['id', 'fantasyName', 'legalName'],
      },
      {
        model: QuotationsResponse,
        as: 'quotation',
      }],
      group: ['quotation_request_supplier_mappings.id'],
      subQuery: false,
    });
    const assignedSuppliers = quotations
      .map(({ supplier }) => supplier);
    response = OkResponse(assignedSuppliers, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while fetching quotation by ID:', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  getQuotationAssignedForResponseHandler,
};
