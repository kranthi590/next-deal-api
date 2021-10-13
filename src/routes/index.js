const { OkResponse } = require('../helpers/response.transforms');
const { validateMiddleware } = require('../middleware');
const registerSupplier = require('./handlers/supplier/register.handler');
const fetchRegionsByCountryCode = require('./handlers/config/regions.handler');
const fetchComunasByRegion = require('./handlers/config/comunas.handler');

const initRoutes = (app) => {
  app.get(['/', '/health'], (req, res) => {
    const response = OkResponse(null, req.traceId, 'OK Response');
    res.status(response.status).json(response);
  });

  // Supplier routes
  app.post('/supplier/register', validateMiddleware, registerSupplier);

  // Register config routes
  app.get('/config/countries/:countryCode/regions', fetchRegionsByCountryCode);
  app.get('/config/regions/:regionId/comunas', fetchComunasByRegion);
};

module.exports = initRoutes;
