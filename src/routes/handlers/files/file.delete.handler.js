const logger = require('../../../helpers/logger');
const { getStorage } = require('../../../helpers/bucket.utils');
const { InternalServerErrorResponse, OkResponse } = require('../../../helpers/response.transforms');
const { getFileById } = require('./file.get.handler');
const { getConnection } = require('../../../helpers/mysql');
const { Files } = require('../../../helpers/db.models');

const deleteFile = async ({
  id,
  bucketName,
  fileLocation,
}) => getConnection().transaction(async (t) => {
  await Files.destroy({
    where: {
      id,
    },
    transaction: t,
  });
  await getStorage()
    .bucket(bucketName)
    .file(fileLocation)
    .delete({
      force: true,
    });
});

const deleteFileHandler = async (req, res) => {
  let response;
  try {
    const file = await getFileById(req.params.fileId);
    if (!file) {
      throw new Error();
    }
    await deleteFile(file);
    response = OkResponse({}, req.traceId);
  } catch (error) {
    logger.error('Error while deleting file:', error);
    response = InternalServerErrorResponse('', req.traceId);
  }
  res.status(response.status).json(response);
};

module.exports = {
  deleteFileHandler,
};
