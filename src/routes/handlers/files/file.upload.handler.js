const { uploadFile } = require('../../../helpers/bucket.utils');
const {
  FILE_TYPE,
  INVALID_FILE_TYPE,
  INVALID_FILE,
} = require('../../../helpers/constants');
const { Files } = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');
const { generateFileURL } = require('../../../helpers/generate.file.url');
const logger = require('../../../helpers/logger');
const { OkResponse } = require('../../../helpers/response.transforms');
const prepareProjectContext = require('./prepare.context/project.context');
const prepareSupplierContext = require('./prepare.context/supplier.context');

const saveFileAndUpdateMeta = async (req, context) => {
  const { files, traceId } = req;
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
  })));
  const filesMeta = generateFileURL(saveResponses.map(({ fileLocation, fileName }, index) => ({
    isPublic,
    bucketName,
    fileLocation,
    name: fileName,
    id: filesSaveResponses[index].id,
  })));
  return OkResponse(filesMeta, traceId);
};

const uploadFileHandler = async (req, res) => {
  let response;
  let context;
  try {
    const { fileType } = req.body;
    if (req.files.length === 0) {
      throw INVALID_FILE;
    }
    if (fileType === FILE_TYPE.SUPPLIER_LOGO) {
      context = await prepareSupplierContext(req);
      response = await saveFileAndUpdateMeta(req, context);
    } else if (fileType === FILE_TYPE.PROJECT) {
      context = await prepareProjectContext(req);
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
