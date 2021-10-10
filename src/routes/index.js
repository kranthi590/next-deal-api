const { OkResponse } = require('../helpers/response.transforms');
const { validateMiddleware } = require('../middleware');
const { registerBusiness } = require('./business.handler');
const { fetchRegionsByCountryCode } = require('./countries.handler');

const initRoutes = (app) => {
  app.get(['/', '/health'], (req, res) => {
    const response = OkResponse(null, req.traceId, 'OK Response');
    res.status(response.status).json(response);
  });

  // Register business routes
  app.post('/business', validateMiddleware, registerBusiness);

  // Register config routes
  app.get('/config/countries/:countryCode/regions', fetchRegionsByCountryCode);
};

module.exports = initRoutes;
