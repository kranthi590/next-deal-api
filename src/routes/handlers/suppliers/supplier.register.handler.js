const { createBucket } = require('../../../helpers/bucket.utils');
const { SUPPLIER_BUCKET_FORMAT, ER_DUP_ENTRY_RUT } = require('../../../helpers/constants');
const { Suppliers, SuppliersV2 } = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');
const generateCode = require('../../../helpers/generate.code');

const logger = require('../../../helpers/logger');
const { getConnection } = require('../../../helpers/mysql');

const { ResourceCreatedResponse } = require('../../../helpers/response.transforms');

const saveSupplierWithMappings = async ({
  legalName,
  fantasyName,
  rut,
  webSiteUrl,
  emailId,
  isShared,
  inchargeFullName,
  inchargeRole,
  businessAddress,
  billingAddress,
  contactInfo,
  categories,
  serviceLocations,
  type,
  comments,
}, req) => getConnection().transaction(async (t) => {
  const data = {
    legalName,
    fantasyName,
    rut,
    webSiteUrl,
    emailId,
    isShared,
    inchargeFullName,
    inchargeRole,
    type,
    categories: categories.map((categoryId) => ({
      category_id: categoryId,
    })),
    comments,
  };
  const query = {
    transaction: t,
    include: ['categories'],
  };
  if (businessAddress) {
    data.businessAddress = businessAddress;
    query.include.push('businessAddress');
  }
  if (serviceLocations) {
    data.serviceLocations = serviceLocations.map((regionId) => ({
      region_id: regionId,
    }));
    query.include.push('serviceLocations');
  }
  if (billingAddress) {
    data.billingAddress = billingAddress;
    query.include.push('billingAddress');
  }
  if (contactInfo) {
    data.contactInfo = contactInfo;
    query.include.push('contactInfo');
  }
  if (req.user && req.user.buyerId) {
    data.buyerId = req.user.buyerId;
  }
  const SupplierModel = req.originalUrl.includes('v1') ? Suppliers : SuppliersV2;
  const supplier = await SupplierModel.create(data, query);
  const supplierBucketName = SUPPLIER_BUCKET_FORMAT.replace('bucket', `${generateCode(supplier.legalName)}-${supplier.id}`);
  try {
    await createBucket(supplierBucketName);
  } catch (error) {
    logger.error(`Error while creating bucket ${supplierBucketName}: ${error}`);
    throw error;
  }
  return supplier.dataValues;
});

const registerSupplier = async (req, res) => {
  let response;
  try {
    if (!req.user || !req.user.buyerId) {
      // Check if RUT exists in DB with buyerId as NULL
      const supplier = await Suppliers.findOne({
        where: {
          rut: req.body.rut,
          buyerId: null,
        },
      });
      if (supplier) {
        throw new Error(ER_DUP_ENTRY_RUT);
      }
    }
    const result = await saveSupplierWithMappings(req.body, req);
    response = ResourceCreatedResponse(result, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId, 'supplier');
    logger.error('Error while registering supplier', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  registerSupplier,
  saveSupplierWithMappings,
};
