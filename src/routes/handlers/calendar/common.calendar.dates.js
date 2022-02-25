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
  dateField,
  startDate,
  endDate,
}) => QuotationsResponse.findAll({
  attributes: ['id', dateField, 'comments', 'supplierId', 'isAwarded'],
  where: {
    [dateField]: {
      [Op.and]: {
        [Op.gte]: startDate,
        [Op.lte]: endDate,
      },
    },
    isDeleted: false,
    isAwarded: true,
  },
  include: [
    {
      model: QuotationsRequest,
      as: 'quotation',
      attributes: ['name', 'comments'],
      required: true,
      where: {
        status: dateField === DATE_FIELD_TYPES.VALIDITY_DATE_TYPE ? {
          [Op.or]: [QUOTATION_STATUS.IN_PROGRESS, QUOTATION_STATUS.CREATED],
        } : QUOTATION_STATUS.AWARDED,
        isDeleted: false,
      },
      include: [
        {
          model: Projects,
          as: 'project',
          attributes: ['name', 'id'],
          where: { buyerId, isDeleted: false },
          required: true,
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
