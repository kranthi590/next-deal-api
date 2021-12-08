const { INVALID_SUPPLIER_ID, SUPPLIER_BUCKET_FORMAT, FILE_TYPE } = require('../../../../helpers/constants');
const generateCode = require('../../../../helpers/generate.code');
const { getSupplier } = require('../../suppliers/supplier.get.handler');

const prepareSupplierContext = async (req) => {
  if (!req.body.supplierId) {
    throw new Error(INVALID_SUPPLIER_ID);
  }
  const [supplier] = await getSupplier(req.body.supplierId);
  if (!supplier) {
    throw new Error(INVALID_SUPPLIER_ID);
  }
  console.log(supplier);
  return {
    bucketName: SUPPLIER_BUCKET_FORMAT.replace(
      'bucket',
      `${generateCode(supplier.legalName)}-${supplier.id}`,
    ),
    isPublic: true,
    entityId: supplier.id,
    folder: 'logo',
    entityType: FILE_TYPE.SUPPLIER_LOGO,
  };
};

module.exports = prepareSupplierContext;
