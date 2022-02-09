const { Op } = require('sequelize');
const { QUOTATION_STATUS } = require('../../../helpers/constants');
const {
  QuotationsResponse,
  QuotationsRequest,
  Projects,
  Suppliers,
} = require('../../../helpers/db.models');

const DATE_FIELD_TYPES = {
  VALIDITY_DATE_TYPE: 'validityDate',
  DELIVERY_DATE_TYPE: 'deliveryDate',
};

const fetchQuotationsByDatesAndBuyer = async ({
  buyerId,
  dataField,
  startDate,
  endDate,
}) => QuotationsResponse.findAll({
  attributes: ['id', dataField, 'comments', 'supplierId', 'isAwarded'],
  where: {
    [dataField]: {
      [Op.and]: {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      },
    },
  },
  include: [
    {
      model: QuotationsRequest,
      as: 'quotation',
      attributes: ['name', 'description'],
      required: true,
      where: {
        status:
            dataField === DATE_FIELD_TYPES.VALIDITY_DATE_TYPE
              ? QUOTATION_STATUS.IN_PROGRESS
              : QUOTATION_STATUS.AWARDED,
      },
      include: [
        {
          model: Projects,
          as: 'project',
          attributes: ['name', 'id'],
          where: { buyerId },
          required: true,
          //  include: ['buyer'],
        },
      ],
    },
    {
      model: Suppliers,
      as: 'supplier',
      attributes: ['fantasyName'],
    },
  ],
});

module.exports = {
  fetchQuotationsByDatesAndBuyer,
  DATE_FIELD_TYPES,
};
