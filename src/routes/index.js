const Multer = require('multer');

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

const { OkResponse } = require('../helpers/response.transforms');
const { validateMiddleware, authMiddleware, verifyDomainMiddleware } = require('../middleware');
const registerSupplier = require('./handlers/suppliers/supplier.register.handler');
const fetchRegionsByCountryCode = require('./handlers/config/config.regions.handler');
const fetchComunasByRegion = require('./handlers/config/config.comunas.handler');
const { getSupplierHandler } = require('./handlers/suppliers/supplier.get.handler');
const { registerBuyerHandler } = require('./handlers/buyers/buyer.register.handler');
const { getBuyerHandler } = require('./handlers/buyers/buyer.get.handler');
const { registerUserHandler } = require('./handlers/users/user.register.handler');
const { getUserHandler } = require('./handlers/users/user.get.handler');
const { userLoginHandler } = require('./handlers/users/user.login.handler');
const { getStorage } = require('../helpers/bucket.utils');
const logger = require('../helpers/logger');
const { projectCreationHandler } = require('./handlers/projects/project.create.handler');

const initRoutes = (app) => {
  app.get('/profile', (req, res) => {
    try {
      const fileStream = getStorage()
        .bucket('node-files')
        .file('APPLICATION FORM FOR PCC.pdf')
        .createReadStream(); // stream is created
      fileStream.on('error', (err) => {
        logger.error('Error!', err);
        res.status(400).json({ status: '404' });
      });
      fileStream.pipe(res);
    } catch (error) {
      logger.error('Error!', error);
      res.status(400).json({ status: '404' });
    }
  });

  // Process the file upload and upload to Google Cloud Storage.
  app.post('/upload', multer.single('file'), (req, res, next) => {
    if (!req.file) {
      res.status(400).send('No file uploaded.');
      return;
    }

    const bucket = getStorage().bucket('buyer-housestarcks121-21');

    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file(`folder/folder1/${req.file.originalname}`);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', (err) => {
      next(err);
    });

    blobStream.on('finish', () => {
      res.status(200).send({ status: 'success' });
    });

    blobStream.end(req.file.buffer);
  });

  app.get(['/', '/health'], (req, res) => {
    const response = OkResponse(null, req.traceId, 'OK Response');
    res.status(response.status).json(response);
  });

  // Supplier routes
  app.post('/supplier/register', validateMiddleware, registerSupplier);
  app.get('/supplier/:supplierId', getSupplierHandler);

  // Buyer routes
  app.post('/buyer/register', validateMiddleware, registerBuyerHandler);
  app.get('/buyer/:buyerId', getBuyerHandler);

  // User routes
  app.post('/user/register', validateMiddleware, registerUserHandler);
  app.get('/user/profile', authMiddleware, verifyDomainMiddleware, getUserHandler);
  app.post('/user/login', validateMiddleware, userLoginHandler);

  // Register config routes
  app.get('/config/countries/:countryCode/regions', fetchRegionsByCountryCode);
  app.get('/config/countries/:countryCode/regions/:regionId/comunas', fetchComunasByRegion);

  // Projects routes
  app.post(
    '/project/create',
    validateMiddleware,
    authMiddleware,
    verifyDomainMiddleware,
    projectCreationHandler,
  );
};

module.exports = initRoutes;
