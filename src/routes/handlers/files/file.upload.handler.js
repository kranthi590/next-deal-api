const { uploadFile } = require('../../../helpers/bucket.utils');
const {
  FILE_TYPE,
  INVALID_FILE_TYPE,
  INVALID_FILE,
  INVALID_ASSET_RELATION_ID,
  INVALID_ASSET_RELATION,
} = require('../../../helpers/constants');
const { Files } = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');
const { generateFileURL } = require('../../../helpers/generate.file.url');
const logger = require('../../../helpers/logger');
const { OkResponse } = require('../../../helpers/response.transforms');
const { prepareProjectContext } = require('./prepare.context/project.context');
const prepareQuotationRequestContext = require('./prepare.context/quotation.request.context');
const {
  prepareQuotationResponseContext,
} = require('./prepare.context/quotation.response.context');
const prepareSupplierContext = require('./prepare.context/supplier.context');

const saveFileAndUpdateMeta = async (req, context) => {
  const { files, traceId, user } = req;
  const {
    bucketName, isPublic, folder, entityId, entityType,
  } = context;
  const saveResponses = await Promise.all(files.map((file) => uploadFile({
    file,
    isPublic,
    folder,
    bucketName,
  })));
  // eslint-disable-next-line max-len
  const filesSaveResponses = await Promise.all(saveResponses.map(({ fileLocation, fileName, file }) => Files.create({
    entityId,
    name: fileName,
    mimeType: file.mimetype,
    fileLocation,
    entityType,
    isPublic,
    fileSize: file.size,
    bucketName,
    uploadedBy: user ? user.userId : null,
  })));
  // eslint-disable-next-line max-len
  const filesMeta = generateFileURL(saveResponses.map(({ fileLocation, fileName, file }, index) => ({
    isPublic,
    bucketName,
    fileLocation,
    name: fileName,
    id: filesSaveResponses[index].id,
    mimeType: file.mimetype,
  })));
  return OkResponse(filesMeta, traceId);
};

const uploadFileHandler = async (req, res) => {
  let response;
  let context;
  try {
    const { assetRelation, assetRelationId } = req.body;
    if (req.files.length === 0) {
      throw INVALID_FILE;
    }
    if (!assetRelation || !assetRelationId) {
      throw !assetRelation ? INVALID_ASSET_RELATION : INVALID_ASSET_RELATION_ID;
    }
    if (assetRelation === FILE_TYPE.SUPPLIER_LOGO) {
      context = await prepareSupplierContext(req);
      response = await saveFileAndUpdateMeta(req, context);
    } else if (assetRelation === FILE_TYPE.PROJECT) {
      context = await prepareProjectContext(req);
      response = await saveFileAndUpdateMeta(req, context);
    } else if (assetRelation === FILE_TYPE.QUOTATION_REQUEST) {
      context = await prepareQuotationRequestContext(req);
      response = await saveFileAndUpdateMeta(req, context);
    } else if (assetRelation === FILE_TYPE.QUOTATION_RESPONSE) {
      context = await prepareQuotationResponseContext(req);
      response = await saveFileAndUpdateMeta(req, context);
    } else {
      throw Error(INVALID_FILE_TYPE);
    }
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while uploading file', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  uploadFileHandler,
};
