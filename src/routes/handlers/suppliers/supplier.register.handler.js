const { createBucket } = require('../../../helpers/bucket.utils');
const { SUPPLIER_BUCKET_FORMAT } = require('../../../helpers/constants');
const { Suppliers } = require('../../../helpers/db.models');
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
  logoUrl,
  isShared,
  inchargeFullName,
  inchargeRole,
  businessAddress,
  billingAddress,
  contactInfo,
  categories,
  serviceLocations,
  type,
}) => getConnection().transaction(async (t) => {
  const data = {
    legalName,
    fantasyName,
    rut,
    webSiteUrl,
    emailId,
    logoUrl,
    isShared,
    inchargeFullName,
    inchargeRole,
    type,
    businessAddress,
    categories: categories.map((categoryId) => ({
      category_id: categoryId,
    })),
    serviceLocations: serviceLocations.map((regionId) => ({
      region_id: regionId,
    })),
  };
  const query = {
    transaction: t,
    include: ['businessAddress', 'categories', 'serviceLocations'],
  };
  if (billingAddress) {
    data.billingAddress = billingAddress;
    query.include.push('billingAddress');
  }
  if (contactInfo) {
    data.contactInfo = contactInfo;
    query.include.push('contactInfo');
  }
  const supplier = await Suppliers.create(data, query);
  try {
    const supplierBucketName = SUPPLIER_BUCKET_FORMAT.replace('bucket', `${generateCode(supplier.legalName)}-${supplier.id}`);
    await createBucket(supplierBucketName);
  } catch (error) {
    logger.error(`Error while creating bucket: ${error}`);
    throw error;
  }
  return supplier.dataValues;
});

const registerSupplier = async (req, res) => {
  let response;
  try {
    const result = await saveSupplierWithMappings(req.body);
    response = ResourceCreatedResponse(result, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while registering supplier', error);
  }
  res.status(response.status).json(response);
};

module.exports = registerSupplier;