const logger = require('../../../helpers/logger');

const {
  Supplier,
  SupplierCategoryMapping,
  SupplierServiceLocationsMappings,
} = require('../../../helpers/db.models');
const { InternalServerErrorResponse, OkResponse } = require('../../../helpers/response.transforms');

const getSupplier = async (supplierId) => {
  const query = {
    include: ['businessAddress', 'inchargeAddress', 'billingAddress'],
    where: {
      active: 1,
      id: supplierId,
    },
    attributes: {},
    raw: true,
    nest: true,
  };
  return Supplier.findOne(query);
};

const supplierMappingsAsync = async (supplierId) => {
  const [supplierCategoryMapping, supplierServiceLocationsMappings] = await Promise.all([
    SupplierCategoryMapping.findAll({
      where: { supplier_id: supplierId },
      include: ['category'],
      raw: true,
      nest: true,
      attributes: {},
    }),
    SupplierServiceLocationsMappings.findAll({
      where: { supplier_id: supplierId },
      include: ['region'],
      raw: true,
      nest: true,
      attributes: {},
    }),
  ]);
  return {
    categories: supplierCategoryMapping.map((supplierCategory) => supplierCategory.category),
    serviceLocations: supplierServiceLocationsMappings.map(
      (supplierServiceLocationsMapping) => supplierServiceLocationsMapping.region,
    ),
  };
};

const getSupplierHandler = async (req, res) => {
  let response;
  try {
    const supplier = await getSupplier(req.params.supplierId);
    const { categories, serviceLocations } = await supplierMappingsAsync(supplier.id);
    supplier.categories = categories;
    supplier.serviceLocations = serviceLocations;
    response = OkResponse(supplier, req.traceId);
  } catch (error) {
    response = InternalServerErrorResponse('', req.traceId);
    logger.error(`Error while fetching country by code ${error}`);
  }
  res.status(response.status).json(response);
};

module.exports = {
  getSupplier,
  getSupplierHandler,
};
