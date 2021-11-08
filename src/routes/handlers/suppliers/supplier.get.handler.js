const logger = require('../../../helpers/logger');

const { Suppliers } = require('../../../helpers/db.models');
const { InternalServerErrorResponse, OkResponse } = require('../../../helpers/response.transforms');
const { generateFileURL } = require('../../../helpers/generate.file.url');

const getSupplier = async (supplierId) => {
  const query = {
    include: ['businessAddress', 'categories', 'serviceLocations', 'billingAddress', 'contactInfo', 'logo'],
    where: {
      id: supplierId,
    },
    exclude: ['in_charge_address_id'],
  };
  return Suppliers.findOne(query);
};

const getSupplierHandler = async (req, res) => {
  let response;
  try {
    const data = await getSupplier(req.params.supplierId);
    const supplier = JSON.parse(JSON.stringify(data));
    if (supplier.logo) {
      supplier.logo = generateFileURL(supplier.logo);
    }
    response = OkResponse(supplier, req.traceId);
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
