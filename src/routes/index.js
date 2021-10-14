const { OkResponse } = require('../helpers/response.transforms');
const { validateMiddleware } = require('../middleware');
const registerSupplier = require('./handlers/supplier/register.handler');
const fetchRegionsByCountryCode = require('./handlers/config/regions.handler');
const fetchComunasByRegion = require('./handlers/config/comunas.handler');
const { getSupplierHandler } = require('./handlers/supplier/get.handler');
const { registerBuyerHandler } = require('./handlers/buyer/register.handler');
const { getBuyerHandler } = require('./handlers/buyer/get.handler');

const initRoutes = (app) => {
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

  // Register config routes
  app.get('/config/countries/:countryCode/regions', fetchRegionsByCountryCode);
  app.get('/config/regions/:regionId/comunas', fetchComunasByRegion);
};

module.exports = initRoutes;
