const generateFileURL = (files = []) => files.map((file) => {
  const fileUrl = file.isPublic
    ? `https://storage.googleapis.com/${file.bucketName}/${file.fileLocation}`
    : `${process.env.NEXT_DEAL_SERVICE_URL}/files/${file.id}/${file.name}`;
  return {
    fileUrl,
  };
});

module.exports = { generateFileURL };
