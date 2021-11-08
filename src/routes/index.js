const express = require('express');

const router = express.Router();

const { OkResponse } = require('../helpers/response.transforms');
const {
  validateMiddleware, authMiddleware, verifyDomainMiddleware, multerUploadMiddleware,
} = require('../middleware');
const fetchRegionsByCountryCode = require('./handlers/config/config.regions.handler');
const fetchComunasByRegion = require('./handlers/config/config.comunas.handler');

const registerSupplier = require('./handlers/suppliers/supplier.register.handler');
const { getSupplierHandler } = require('./handlers/suppliers/supplier.get.handler');
const { uploadSupplierLogoHandler } = require('./handlers/suppliers/supplier.upload.logo.handler');

const { registerBuyerHandler } = require('./handlers/buyers/buyer.register.handler');
const { getBuyerHandler } = require('./handlers/buyers/buyer.get.handler');

const { registerUserHandler } = require('./handlers/users/user.register.handler');
const { getUserHandler } = require('./handlers/users/user.get.handler');
const { userLoginHandler } = require('./handlers/users/user.login.handler');

const { getFileHandler } = require('./handlers/files/file.get.handler');

const { projectCreationHandler } = require('./handlers/projects/project.create.handler');
const { projectsListHandler } = require('./handlers/projects/project.list.handler');

router.get(['/', '/health'], (req, res) => {
  const response = OkResponse(null, req.traceId, 'OK Response');
  res.status(response.status).json(response);
});

// Supplier routes
router.post('/suppliers', validateMiddleware, registerSupplier);
router.get('/supplier/:supplierId', getSupplierHandler);
router.post('/suppliers/files', multerUploadMiddleware, uploadSupplierLogoHandler);

// Buyer routes
router.post('/buyers', validateMiddleware, registerBuyerHandler);
router.get('/buyers/:buyerId', getBuyerHandler);

// User routes
router.post('/users', validateMiddleware, registerUserHandler);
router.get('/users/:userId', authMiddleware, verifyDomainMiddleware, getUserHandler);
router.post('/users/login', validateMiddleware, userLoginHandler);

// Register config routes
router.get('/config/countries/:countryCode/regions', fetchRegionsByCountryCode);
router.get('/config/countries/:countryCode/regions/:regionId/comunas', fetchComunasByRegion);

// Projects routes
router.post(
  '/buyers/:buyerId/projects',
  validateMiddleware,
  authMiddleware,
  verifyDomainMiddleware,
  projectCreationHandler,
);
router.get(
  '/buyers/:buyerId/projects',
  authMiddleware,
  verifyDomainMiddleware,
  projectsListHandler,
);

// Files Routes
router.get('/files/:fileId/:fileName', getFileHandler);

module.exports = router;
