const logger = require('../../../helpers/logger');

const { Suppliers, SupplierCategoryMappings } = require('../../../helpers/db.models');
const { InternalServerErrorResponse, OkResponse } = require('../../../helpers/response.transforms');
const { initPagination } = require('../../../helpers/init.pagination');

const getBuyerCategorySuppliersHandler = async (req, res) => {
  let response;
  try {
    const {
      limit,
      offset,
    } = initPagination(req);
    const query = {
      where: {
        buyerId: req.user.buyerId,
      },
      attributes: ['id', 'legalName', 'emailId', 'isShared'],
      limit,
      offset,
      include: [
        {
          model: SupplierCategoryMappings,
          as: 'categories',
          required: true,
          where: {
            category_id: req.params.categoryId,
          },
          attributes: [],
        },
      ],
    };
    const suppliers = await Suppliers.findAndCountAll(query);
    suppliers.limit = limit;
    suppliers.offset = offset;
    response = OkResponse(suppliers, req.traceId);
  } catch (error) {
    response = InternalServerErrorResponse('', req.traceId);
    logger.error('Error while fetching buyers supplier', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  getBuyerCategorySuppliersHandler,
};
