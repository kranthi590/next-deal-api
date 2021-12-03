const { FILE_TYPE, INVALID_FILE_TYPE } = require('../../../helpers/constants');
const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');

const { uploadSupplierLogoHandler } = require('./upload.supplier.logo');

const uploadFileHandler = async (req, res) => {
  let response;
  try {
    const { fileType } = req.body;
    switch (fileType) {
      case FILE_TYPE.SUPPLIER_LOGO:
        response = await uploadSupplierLogoHandler(req);
        break;
      default:
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
