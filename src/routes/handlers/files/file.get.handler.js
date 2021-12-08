const logger = require('../../../helpers/logger');
const { getStorage } = require('../../../helpers/bucket.utils');
const { Files } = require('../../../helpers/db.models');
const { InternalServerErrorResponse } = require('../../../helpers/response.transforms');

const getFileById = (fileId) => {
  const query = {
    where: {
      id: fileId,
    },
  };
  return Files.findOne(query);
};

const getFileHandler = async (req, res) => {
  try {
    const file = await getFileById(req.params.fileId);
    if (!file) {
      throw new Error();
    }
    const fileStream = getStorage()
      .bucket(file.bucketName)
      .file(file.fileLocation)
      .createReadStream();
    fileStream.on('error', (err) => {
      logger.error('Error while getting file:', err);
      const resp = InternalServerErrorResponse('', req.traceId);
      res.status(resp.status).json(resp);
    });
    res.setHeader('Content-Length', file.dataValues.fileSize);
    res.setHeader('Content-Type', file.dataValues.mimeType);
    fileStream.pipe(res);
  } catch (error) {
    logger.error('Error while getting file:', error);
    const resp = InternalServerErrorResponse('', req.traceId);
    res.status(resp.status).json(resp);
  }
};

module.exports = {
  getFileHandler,
};
