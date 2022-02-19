const generateFileURL = (files = []) => files.map(({
  isPublic,
  fileLocation,
  id,
  name,
  mimeType,
  bucketName,
}) => {
  const fileUrl = isPublic
    ? `https://storage.googleapis.com/${bucketName}/${fileLocation}`
    : `${process.env.NEXT_DEAL_SERVICE_URL}/files/${id}/${name}`;
  return {
    fileUrl: encodeURI(fileUrl),
    name,
    mimeType,
  };
});

module.exports = { generateFileURL };
