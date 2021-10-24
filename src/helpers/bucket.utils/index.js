const { Storage } = require('@google-cloud/storage');

const logger = require('../logger');

let storage;

const init = async () => {
  try {
    storage = new Storage({ keyFilename: `${__dirname}/key.json` });
    logger.info('Connected to storage bucket successfully..');
    return true;
  } catch (error) {
    logger.error(`error while connecting to bucket: ${error}`);
    return false;
  }
};

const getStorage = () => storage;

const createBucket = async (bucketName) => {
  await storage.bucket(bucketName).create({ location: process.env.GCP_STORAGE_REGION });
  logger.info(`Created bucket: ${bucketName} successfully`);
};

module.exports = {
  initStorage: init,
  getStorage,
  createBucket,
};
