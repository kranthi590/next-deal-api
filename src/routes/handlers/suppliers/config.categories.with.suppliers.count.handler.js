const { Sequelize, Op } = require('sequelize');
const { Categories, SupplierCategoryMappings, Suppliers } = require('../../../helpers/db.models');

const logger = require('../../../helpers/logger');
const {
  OkResponse,
  InternalServerErrorResponse,
} = require('../../../helpers/response.transforms');

const fetchAllCategoriesWithSuppliersCount = async (req, res) => {
  let response;
  try {
    const query = {
      where: {
        active: true,
      },
      attributes: [
        'name',
        'id',
        [Sequelize.fn('COUNT', Sequelize.col('category_mappings.id')), 'suppliersCount'],
      ],
      include: [
        {
          model: SupplierCategoryMappings,
          as: 'category_mappings',
          attributes: [],
          include: [{
            model: Suppliers,
            as: 'suppliers',
            where: {
              buyerId: req.user.buyerId,
            },
            attributes: [],
            required: true,
          }],
        },
      ],
      group: ['categories.id'],
      order: [
        ['name', 'ASC'],
      ],
      having: { suppliersCount: { [Op.gt]: 0 } },
    };
    const dbResponse = await Categories.findAll(query);
    response = OkResponse(dbResponse, req.traceId);
  } catch (error) {
    response = InternalServerErrorResponse('', req.traceId);
    logger.error('Error while fetching categories', error);
  }
  res.status(response.status).json(response);
};

module.exports = { fetchAllCategoriesWithSuppliersCount };
