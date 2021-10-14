const _ = require('lodash');
const {
  Supplier,
  Address,
  BusinessAddress,
  SupplierCategoryMapping,
  SupplierServiceLocationsMappings,
} = require('../../../helpers/db.models');

const logger = require('../../../helpers/logger');
const { getConnection } = require('../../../helpers/mysql');

const {
  InternalServerErrorResponse,
  OkResponse,
  ConflictResponse,
} = require('../../../helpers/response.transforms');
const { getSupplier } = require('./get.handler');

const saveSupplierWithMappings = async (body) => {
  const result = await getConnection().transaction(async (t) => {
    const addressesPromises = [
      BusinessAddress.create(body.businessAddress, {
        transaction: t,
      }),
    ];

    const contactAddressRequest = body.inchargeContactInfo;
    if (!_.isEmpty(contactAddressRequest)) {
      addressesPromises.push(Address.create(contactAddressRequest, { transaction: t }));
    }

    const billingAddressRequest = body.billingAddress;
    if (!_.isEmpty(billingAddressRequest)) {
      addressesPromises.push(Address.create(billingAddressRequest, { transaction: t }));
    }

    const [businessAddress, address1, address2] = await Promise.all(addressesPromises);
    const supplierRequest = body;
    supplierRequest.businessAddressId = businessAddress.dataValues.id;

    if (!_.isEmpty(contactAddressRequest)) {
      supplierRequest.inChargeAddressId = address1.dataValues.id;
    }
    if (!_.isEmpty(contactAddressRequest) && !_.isEmpty(billingAddressRequest)) {
      supplierRequest.billingAddressId = address2.dataValues.id;
    }

    if (_.isEmpty(contactAddressRequest) && !_.isEmpty(billingAddressRequest)) {
      supplierRequest.billingAddressId = address1.dataValues.id;
    }

    const supplier = await Supplier.create(supplierRequest, { transaction: t });

    const mappingsPromiseArray = [
      SupplierCategoryMapping.bulkCreate(
        body.categories.map((category) => ({
          supplier_id: supplier.dataValues.id,
          category_id: category,
        })),
        { transaction: t },
      ),
      SupplierServiceLocationsMappings.bulkCreate(
        body.serviceLocations.map((serviceLocation) => ({
          supplier_id: supplier.dataValues.id,
          region_id: serviceLocation,
        })),
        { transaction: t },
      ),
    ];

    await Promise.all(mappingsPromiseArray);
    return supplier;
  });
  return result;
};

const registerSupplier = async (req, res) => {
  let response;
  try {
    const result = await saveSupplierWithMappings(req.body);
    const supplier = await getSupplier(result.id);
    response = OkResponse(supplier, req.traceId);
  } catch (error) {
    const errorCode = _.get(error, 'original.code', null);
    const isRutDuplicate = _.get(error, 'fields.rut', false);
    if (errorCode === 'ER_DUP_ENTRY' && isRutDuplicate) {
      response = ConflictResponse('ER_DUP_ENTRY_RUT', req.traceId);
    } else {
      response = InternalServerErrorResponse('', req.traceId);
    }
    logger.error('Error while registering supplier', error);
  }
  res.status(response.status).json(response);
};

module.exports = registerSupplier;
