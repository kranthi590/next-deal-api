const logger = require('../../../helpers/logger');

const { Supplier } = require('../../../helpers/db.models/supplier.model');
const { InternalServerErrorResponse, OkResponse } = require('../../../helpers/response.transforms');

const getSupplier = async (supplierId) => {
  const query = {
    include: ['businessAddress', 'categories', 'serviceLocations', 'billingAddress', 'contactInfo'],
    where: {
      id: supplierId,
    },
    exclude: ['in_charge_address_id'],
  };
  return Supplier.findOne(query);
};

const getSupplierHandler = async (req, res) => {
  let response;
  try {
    const supplier = await getSupplier(req.params.supplierId);
    response = OkResponse(supplier, req.traceId);
  } catch (error) {
    response = InternalServerErrorResponse('', req.traceId);
    logger.error(`Error while fetching supplier ${error}`);
  }
  res.status(response.status).json(response);
};

module.exports = {
  getSupplier,
  getSupplierHandler,
};
