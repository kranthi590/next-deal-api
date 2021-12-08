const logger = require('../../../helpers/logger');

const { Suppliers, Files } = require('../../../helpers/db.models');
const { InternalServerErrorResponse, OkResponse, UnauthorizedResponse } = require('../../../helpers/response.transforms');
const { generateFileURL } = require('../../../helpers/generate.file.url');
const { INVALID_SUPPLIER_ID } = require('../../../helpers/constants');

const getSupplier = async (supplierId) => {
  const query = {
    include: ['businessAddress', 'categories', 'serviceLocations', 'billingAddress', 'contactInfo'],
    where: {
      id: supplierId,
    },
    exclude: ['in_charge_address_id'],
  };
  return Promise.all([
    Suppliers.findOne(query),
    Files.findAll({
      where: { entityId: supplierId },
    }),
  ]);
};

const getSupplierHandler = async (req, res) => {
  let response;
  try {
    const [data, filesMeta] = await getSupplier(req.params.supplierId);
    const supplier = JSON.parse(JSON.stringify(data));
    if (!supplier) {
      response = UnauthorizedResponse(INVALID_SUPPLIER_ID, req.traceId);
    } else {
      if (supplier && supplier.logo) {
        supplier.logo = generateFileURL(supplier.logo);
      }
      response = OkResponse({ ...supplier, logo: generateFileURL(filesMeta) }, req.traceId);
    }
  } catch (error) {
    response = InternalServerErrorResponse('', req.traceId);
    logger.error('Error while fetching supplier', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  getSupplier,
  getSupplierHandler,
};
