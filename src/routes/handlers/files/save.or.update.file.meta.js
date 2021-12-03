const { Files } = require('../../../helpers/db.models');

const saveOrUpdateFileMeta = async ({
  entityId,
  mimeType,
  isPublic,
  fileSize,
  fileLocation,
  name,
  bucketName,
  id,
  entityType,
}) => {
  const data = {
    entityId,
    name,
    mimeType,
    fileLocation,
    entityType,
    isPublic,
    fileSize,
    bucketName,
  };
  return id ? Files.update({
    entityId,
    name,
    mimeType,
    fileLocation,
    entityType,
    isPublic,
    fileSize,
    bucketName,
  }, { returning: true, where: { id } })
    : Files.create(data);
};

module.exports = {
  saveOrUpdateFileMeta,
};
