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
const supplierTransformRequest = require('../../../helpers/request.transforms/supplier');
const addressTransformRequest = require('../../../helpers/request.transforms/address');

const {
  InternalServerErrorResponse,
  OkResponse,
  ConflictResponse,
} = require('../../../helpers/response.transforms');

const saveSupplierWithMappings = async (body) => {
  const result = await getConnection().transaction(async (t) => {
    const businessAddress = await BusinessAddress.create(
      addressTransformRequest(body.businessAddress),
      { transaction: t },
    );

    let contactAddress;
    const contactAddressRequest = addressTransformRequest(body.inchargeContactInfo);
    if (!_.isEmpty(contactAddressRequest)) {
      contactAddress = await Address.create(contactAddressRequest, { transaction: t });
    }

    let billingAddress;
    const billingAddressRequest = addressTransformRequest(body.billingAddress);
    if (!_.isEmpty(billingAddressRequest)) {
      billingAddress = await Address.create(billingAddressRequest, { transaction: t });
    }

    const supplierRequest = supplierTransformRequest(body);
    supplierRequest.business_address_id = businessAddress.dataValues.id;

    if (contactAddress) {
      supplierRequest.in_charge_address_id = contactAddress.dataValues.id;
    }
    if (billingAddress) {
      supplierRequest.billing_address_id = billingAddress.dataValues.id;
    }

    const supplier = await Supplier.create(supplierRequest, { transaction: t });
    await SupplierCategoryMapping.bulkCreate(
      body.categories.map((category) => ({
        supplier_id: supplier.dataValues.id,
        category_id: category,
      })),
      { transaction: t },
    );

    await SupplierServiceLocationsMappings.bulkCreate(
      body.serviceLocations.map((serviceLocation) => ({
        supplier_id: supplier.dataValues.id,
        region_id: serviceLocation,
      })),
      { transaction: t },
    );

    return supplier;
  });

  return result;
};

const registerSupplier = async (req, res) => {
  let response;

  try {
    const result = await saveSupplierWithMappings(req.body);
    response = OkResponse(result, req.traceId);
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
