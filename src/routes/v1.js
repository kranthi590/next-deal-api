const express = require('express');

const router = express.Router();

const { OkResponse } = require('../helpers/response.transforms');
const {
  validateMiddleware, authMiddleware, verifyDomainMiddleware, multerUploadMiddleware, verifyApiKey,
} = require('../middleware');
const fetchRegionsByCountryCode = require('./handlers/config/config.regions.handler');
const fetchComunasByRegion = require('./handlers/config/config.comunas.handler');

const { registerSupplier } = require('./handlers/suppliers/supplier.register.handler');
const { getSupplierHandler } = require('./handlers/suppliers/supplier.get.handler');
const { getSuppliersHandler } = require('./handlers/suppliers/suppliers.list.handler');
const { fetchAllCategoriesWithSuppliersCount } = require('./handlers/suppliers/config.categories.with.suppliers.count.handler');

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
const { getBuyersSupplierHandler } = require('./handlers/buyers/buyer.suppliers.list.handler');
const { getQuotationHandler } = require('./handlers/quotations/quotation.requests.get.handler');
const { getQuotationAssignedForResponseHandler } = require('./handlers/quotations/quotation.response.assigned.handler');
const { awardQuotationHandler } = require('./handlers/quotations/quotation.award.handler');
const { completeQuotationHandler } = require('./handlers/quotations/quotation.complete.handler');
const { getQuotationResponseHandler } = require('./handlers/quotations/quotation.response.get.handler');
const { uploadFileHandler } = require('./handlers/files/file.upload.handler');
const { retainQuotationHandler } = require('./handlers/quotations/quotation.retain.handler');
const { abortQuotationHandler } = require('./handlers/quotations/quotation.abort.handler');
const { activitiesListHandler } = require('./handlers/activities/activities.list.handler');
const { createCustomActivityHandler } = require('./handlers/activities/activity.create.handler');
const { deliveryDatesHandler } = require('./handlers/calendar/calendar.delivery.dates.handler');
const { validityDatesHandler } = require('./handlers/calendar/calendar.validity.dates.handler');
const { extendRegistrationBuyerHandler } = require('./handlers/buyers/buyer.extend.registration.handler');
const { deleteProjectHandler } = require('./handlers/projects/project.delete.handler');
const { deleteQuotationHandler } = require('./handlers/quotations/quotation.request.delete.handler');
const { deleteQuotationResponseHandler } = require('./handlers/quotations/quotation.response.delete.handler');
const fetchAllCategories = require('./handlers/config/config.categories.handler');
const { deleteFileHandler } = require('./handlers/files/file.delete.handler');
const { projectUpdateHandler } = require('./handlers/projects/project.update.handler');
const { getBuyerCategorySuppliersHandler } = require('./handlers/buyers/buyer.category.suppliers.list.handler');
const { quotationRequestAssignSuppliersHandler } = require('./handlers/quotations/quotation.request.assign.supplier.handler');
const { quotationRequestUnassignSuppliersHandler } = require('./handlers/quotations/quotation.request.unassign.supplier.handler');
const { quotationResponseUpdateHandler } = require('./handlers/quotations/quotation.response.update.handler');

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
router.get('/buyers/:buyerId/downloadSuppliers', authMiddleware, downloadBuyersSuppliersHandler);
router.post('/buyers/:buyerId/uploadSuppliers', multerUploadMiddleware, authMiddleware, uploadBuyerSuppliersHandler);
router.get('/buyers/suppliersByCategory/:categoryId', authMiddleware, getBuyerCategorySuppliersHandler);

// User routes
router.post('/users', validateMiddleware, registerUserHandler);
router.get('/users/:userId', authMiddleware, verifyDomainMiddleware, getUserHandler);
router.post('/users/login', validateMiddleware, userLoginHandler);

// Register config routes
router.get('/config/countries/:countryCode/regions', fetchRegionsByCountryCode);
router.get('/config/countries/:countryCode/regions/:regionId/comunas', fetchComunasByRegion);
router.get('/config/categories', fetchAllCategories);
router.get('/config/suppliersCountByCategories', authMiddleware, fetchAllCategoriesWithSuppliersCount);

// Projects routes
router.post('/projects', validateMiddleware, authMiddleware, verifyDomainMiddleware, projectCreationHandler);
router.get('/projects', authMiddleware, verifyDomainMiddleware, projectsListHandler);
router.get('/projects/:projectId', authMiddleware, verifyDomainMiddleware, getProjectHandler);
router.delete('/projects/:projectId', authMiddleware, verifyDomainMiddleware, deleteProjectHandler);
router.patch('/projects', validateMiddleware, authMiddleware, verifyDomainMiddleware, projectUpdateHandler);

// Files Routes
router.get('/files/:fileId/:fileName', authMiddleware, getFileHandler);
router.post('/files', multerUploadMiddleware, uploadFileHandler);
router.post('/secureFiles', authMiddleware, multerUploadMiddleware, uploadFileHandler);
router.delete('/files/:fileId', authMiddleware, deleteFileHandler);

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

router.post(
  '/quotations/:quotationRequestId/assignSuppliers',
  validateMiddleware,
  authMiddleware,
  verifyDomainMiddleware,
  quotationRequestAssignSuppliersHandler,
);

router.delete(
  '/quotations/:quotationRequestId/unassignSuppliers',
  validateMiddleware,
  authMiddleware,
  verifyDomainMiddleware,
  quotationRequestUnassignSuppliersHandler,
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
  validateMiddleware,
  authMiddleware,
  verifyDomainMiddleware,
  awardQuotationHandler,
);

router.post(
  '/quotations/:quotationResponseId/retain',
  validateMiddleware,
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

router.delete(
  '/quotations/:quotationRequestId',
  authMiddleware,
  verifyDomainMiddleware,
  deleteQuotationHandler,
);

router.delete(
  '/quotations/response/:quotationResponseId',
  authMiddleware,
  verifyDomainMiddleware,
  deleteQuotationResponseHandler,
);

router.patch(
  '/quotations/response/:quotationResponseId',
  authMiddleware,
  verifyDomainMiddleware,
  quotationResponseUpdateHandler,
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

// Calendar
router.get(
  '/calender/deliveryDates',
  validateMiddleware,
  authMiddleware,
  verifyDomainMiddleware,
  deliveryDatesHandler,
);

router.get(
  '/calender/validityDates',
  validateMiddleware,
  authMiddleware,
  verifyDomainMiddleware,
  validityDatesHandler,
);

// Internal Routes
router.patch('/buyers/extendRegistration', verifyApiKey, validateMiddleware, extendRegistrationBuyerHandler);

module.exports = router;
