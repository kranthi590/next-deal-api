const { Op } = require('sequelize');
const {
  QuotationsResponse, QuotationsRequest, Projects, Suppliers,
} = require('../../../helpers/db.models');

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
};
