const { Storage } = require('@google-cloud/storage');
const path = require('path');

const logger = require('../logger');

let storage;

const createBucket = async (bucketName) => {
  await storage.bucket(bucketName).create({ location: process.env.GCP_STORAGE_REGION });
  logger.info(`Created bucket: ${bucketName} successfully`);
};

const uploadFile = ({
  file, isPublic, folder, bucketName,
}) => new Promise((resolve, reject) => {
  try {
    const extension = path.extname(file.originalname);
    const fileName = `${new Date().getTime()}${extension}`;
    const fileLocation = `${folder}/${fileName}`;
    const bucket = storage.bucket(bucketName);
    const blob = bucket.file(fileLocation);
    const writeOptions = {
      contentType: file.mimetype,
    };
    if (isPublic) {
      writeOptions.predefinedAcl = 'publicRead';
    }
    const blobStream = blob.createWriteStream(writeOptions);
    blobStream.on('error', (err) => {
      logger.error('Error while uploading file', err);
      reject(err);
    });
    blobStream.on('finish', () => {
      resolve({
        file, fileLocation, fileName, mimeType: file.mimetype,
      });
    });
    blobStream.end(file.buffer);
  } catch (error) {
    logger.error('Error while uploading file', error);
    reject(error);
  }
});

const init = async () => {
  try {
    if (process.env.NODE_ENV === 'develop') {
      const credentials = JSON.parse(process.env.GCP_STORAGE_SERVICE_ACCOUNT);
      storage = new Storage({ credentials, projectId: credentials.project_id });
    } else {
      storage = new Storage();
    }
    logger.info('Connected to storage bucket successfully..');
    return true;
  } catch (error) {
    logger.error('error while connecting to bucket', error);
    return false;
  }
};

const getStorage = () => storage;

module.exports = {
  initStorage: init,
  getStorage,
  createBucket,
  uploadFile,
};
