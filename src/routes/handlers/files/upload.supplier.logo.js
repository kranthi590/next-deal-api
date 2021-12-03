const { uploadFile } = require('../../../helpers/bucket.utils');
const {
  INVALID_SUPPLIER_ID, INVALID_SUPPLIER_LOGO_FILE, SUPPLIER_BUCKET_FORMAT, FILE_TYPE,
} = require('../../../helpers/constants');
const generateCode = require('../../../helpers/generate.code');
const logger = require('../../../helpers/logger');
const { Suppliers } = require('../../../helpers/db.models');

const { OkResponse, BadRequestResponse } = require('../../../helpers/response.transforms');
const { parseError } = require('../../../helpers/error.parser');
const { generateFileURL } = require('../../../helpers/generate.file.url');
const { saveOrUpdateFileMeta } = require('./save.or.update.file.meta');

const getSupplier = async (supplierId) => {
  const query = {
    where: {
      id: supplierId,
    },
    include: ['logo'],
    exclude: ['in_charge_address_id'],
  };
  return Suppliers.findOne(query);
};

const uploadSupplierLogoHandler = async (req) => {
  let response;
  try {
    const isPublic = true;
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
      await saveOrUpdateFileMeta({
        entityId: supplier.id,
        mimeType: logoFile.mimetype,
        isPublic,
        fileSize: logoFile.size,
        fileLocation,
        name: fileName,
        bucketName: supplierBucketName,
        id: supplier.dataValues.logo[0] ? supplier.dataValues.logo[0].id : undefined,
        entityType: FILE_TYPE.SUPPLIER_LOGO,
      });
      response = OkResponse(generateFileURL([{
        isPublic,
        bucketName: supplierBucketName,
        fileLocation,
        name: fileName,
      }]), req.traceId);
    }
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while uploading supplier logo', error);
  }
  return response;
};

module.exports = {
  uploadSupplierLogoHandler,
};
