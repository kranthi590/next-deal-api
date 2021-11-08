const { uploadFile } = require('../../../helpers/bucket.utils');
const {
  INVALID_SUPPLIER_ID, INVALID_SUPPLIER_LOGO_FILE, SUPPLIER_BUCKET_FORMAT, FILE_TYPE,
} = require('../../../helpers/constants');
const generateCode = require('../../../helpers/generate.code');
const logger = require('../../../helpers/logger');
const { Suppliers, Files } = require('../../../helpers/db.models');

const { OkResponse, BadRequestResponse } = require('../../../helpers/response.transforms');
const { parseError } = require('../../../helpers/error.parser');

const getSupplier = async (supplierId) => {
  const query = {
    where: {
      id: supplierId,
    },
    exclude: ['in_charge_address_id'],
  };
  return Suppliers.findOne(query);
};

const saveFileMeta = async ({
  supplierId,
  mimeType,
  isPublic,
  fileSize,
  fileLocation,
  name,
  bucketName,
}) => {
  const data = {
    entityId: supplierId,
    name,
    mimeType,
    fileLocation,
    entityType: FILE_TYPE.SUPPLIER_LOGO,
    isPublic,
    fileSize,
    bucketName,
  };
  return Files.create(data);
};

const uploadSupplierLogoHandler = async (req, res) => {
  let response;
  try {
    const isPublic = false;
    const logoFile = req.files ? req.files.find((file) => file.fieldname === 'logo') : null;
    if (!req.body.supplierId) {
      response = BadRequestResponse([{
        errorCode: INVALID_SUPPLIER_ID,
      }], req.traceId, 'Validation errors');
    } else if (!logoFile) {
      response = BadRequestResponse([{
        errorCode: INVALID_SUPPLIER_LOGO_FILE,
      }], req.traceId, 'Validation errors');
    } else {
      const supplier = await getSupplier(req.body.supplierId);
      if (!supplier) {
        throw new Error(INVALID_SUPPLIER_ID);
      }
      const supplierBucketName = SUPPLIER_BUCKET_FORMAT.replace('bucket', `${generateCode(supplier.legalName)}-${supplier.id}`);
      const { fileLocation, fileName } = await uploadFile({
        file: logoFile,
        isPublic,
        folder: 'logo',
        bucketName: supplierBucketName,
      });
      await saveFileMeta({
        supplierId: supplier.id,
        mimeType: logoFile.mimetype,
        isPublic,
        fileSize: logoFile.size,
        fileLocation,
        name: fileName,
        bucketName: supplierBucketName,
      });
      response = OkResponse(null, req.traceId);
    }
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while uploading supplier logo', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  uploadSupplierLogoHandler,
};
