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
const { getSuppliersHandler } = require('./handlers/suppliers/suppliers.list.handler');

const { registerBuyerHandler } = require('./handlers/buyers/buyer.register.handler');
const { getBuyerHandler } = require('./handlers/buyers/buyer.get.handler');
const { downloadBuyersSuppliersHandler } = require('./handlers/buyers/buyer.suppliers.download.handler');
const { uploadBuyerSuppliersHandler } = require('./handlers/buyers/buyer.upload.suppliers.handler');

const { registerUserHandler } = require('./handlers/users/user.register.handler');
const { getUserHandler } = require('./handlers/users/user.get.handler');
const { userLoginHandler } = require('./handlers/users/user.login.handler');

const { getFileHandler } = require('./handlers/files/file.get.handler');

const { projectCreationHandler } = require('./handlers/projects/project.create.handler');
const { projectsListHandler } = require('./handlers/projects/project.list.handler');
const { getProjectHandler } = require('./handlers/projects/project.get.handler');

const { quotationCreationHandler } = require('./handlers/quotations/quotation.request.create.handler');
const { quotationsListHandler } = require('./handlers/quotations/quotation.requests.list.handler');
const { quotationResponseCreationHandler } = require('./handlers/quotations/quotation.response.create.handler');
const { quotationResponsesListHandler } = require('./handlers/quotations/quotation.responses.list.handler');
const { getBuyersSupplierHandler } = require('./handlers/buyers/buyer.suppliers.get.handler');
const { getQuotationHandler } = require('./handlers/quotations/quotation.requests.get.handler');
const { getQuotationAssignedForResponseHandler } = require('./handlers/quotations/quotation.response.assigned.handler');
const { awardQuotationHandler } = require('./handlers/quotations/quotation.award.handler');
const { completeQuotationHandler } = require('./handlers/quotations/quotation.complete.handler');
const { getQuotationResponseHandler } = require('./handlers/quotations/quotation.response.get.handler');
const { uploadFileHandler } = require('./handlers/files/file.upload.handler');
const { retainQuotationHandler } = require('./handlers/quotations/quotation.retain.handler');
const downloadExcel = require('../middleware/download.excel');
const { abortQuotationHandler } = require('./handlers/quotations/quotation.abort.handler');
const { activitiesListHandler } = require('./handlers/activities/activities.list.handler');
const { createCustomActivityHandler } = require('./handlers/activities/activity.create.handler');

router.get(['/', '/health'], (req, res) => {
  const response = OkResponse(null, req.traceId, 'OK Response');
  res.status(response.status).json(response);
});

// Supplier routes
router.post('/suppliers', validateMiddleware, registerSupplier);
router.get('/suppliers/:supplierId', getSupplierHandler);
router.get('/suppliers', authMiddleware, getSuppliersHandler);

// Buyer routes
router.post('/buyers', validateMiddleware, registerBuyerHandler);
router.get('/buyers/:buyerId', getBuyerHandler);
router.get('/buyers/:buyerId/suppliers', authMiddleware, getBuyersSupplierHandler);
router.post('/buyers/:buyerId/suppliers', validateMiddleware, authMiddleware, registerSupplier);
router.get('/buyers/:buyerId/downloadSuppliers', authMiddleware, downloadBuyersSuppliersHandler, downloadExcel);
router.post('/buyers/:buyerId/uploadSuppliers', multerUploadMiddleware, uploadBuyerSuppliersHandler);

// User routes
router.post('/users', validateMiddleware, registerUserHandler);
router.get('/users/:userId', authMiddleware, verifyDomainMiddleware, getUserHandler);
router.post('/users/login', validateMiddleware, userLoginHandler);

// Register config routes
router.get('/config/countries/:countryCode/regions', fetchRegionsByCountryCode);
router.get('/config/countries/:countryCode/regions/:regionId/comunas', fetchComunasByRegion);

// Projects routes
router.post('/projects', validateMiddleware, authMiddleware,
  verifyDomainMiddleware, projectCreationHandler);

router.get('/projects', authMiddleware, verifyDomainMiddleware, projectsListHandler);

router.get('/projects/:projectId', authMiddleware, verifyDomainMiddleware, getProjectHandler);

// Files Routes
router.get('/files/:fileId/:fileName', authMiddleware, getFileHandler);
router.post('/files', multerUploadMiddleware, uploadFileHandler);
router.post('/secureFiles', authMiddleware, multerUploadMiddleware, uploadFileHandler);

// Quotations routes
router.post('/projects/:projectId/quotations', validateMiddleware, authMiddleware,
  verifyDomainMiddleware, quotationCreationHandler);

router.get(
  '/projects/:projectId/quotations',
  authMiddleware,
  verifyDomainMiddleware,
  quotationsListHandler,
);

router.get(
  '/quotations/:quotationRequestId',
  authMiddleware,
  verifyDomainMiddleware,
  getQuotationHandler,
);

router.post(
  '/quotations/:quotationRequestId/responses',
  validateMiddleware,
  authMiddleware,
  verifyDomainMiddleware,
  quotationResponseCreationHandler,
);

router.get(
  '/quotations/:quotationRequestId/responses',
  authMiddleware,
  verifyDomainMiddleware,
  quotationResponsesListHandler,
);

router.get(
  '/quotations/responses/:quotationResponseId',
  authMiddleware,
  verifyDomainMiddleware,
  getQuotationResponseHandler,
);

router.get(
  '/quotations/:quotationRequestId/suppliers',
  authMiddleware,
  verifyDomainMiddleware,
  getQuotationAssignedForResponseHandler,
);

router.post(
  '/quotations/:quotationResponseId/award',
  authMiddleware,
  verifyDomainMiddleware,
  awardQuotationHandler,
);

router.post(
  '/quotations/:quotationResponseId/retain',
  authMiddleware,
  verifyDomainMiddleware,
  retainQuotationHandler,
);

router.post(
  '/quotations/:quotationResponseId/complete',
  validateMiddleware,
  authMiddleware,
  verifyDomainMiddleware,
  completeQuotationHandler,
);

router.post(
  '/quotations/:quotationRequestId/abort',
  authMiddleware,
  verifyDomainMiddleware,
  abortQuotationHandler,
);

// Activities routes
router.get(
  '/activities/:quotationRequestId',
  authMiddleware,
  verifyDomainMiddleware,
  activitiesListHandler,
);

router.post(
  '/activities',
  validateMiddleware,
  authMiddleware,
  verifyDomainMiddleware,
  createCustomActivityHandler,
);

module.exports = router;
