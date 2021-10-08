const responseBuilder = require('../helpers/api.response');
const { validationMiddleware } = require('../middleware');
const { registerBusiness } = require('./business.handler');
const { fetchRegionsByCountryId } = require('./countries.handler');

const initRoutes = (app) => {
  app.get(['/', '/health'], (req, res) => {
    const response = responseBuilder(200, 'OK Response');
    res.status(response.status).json(response);
  });

  // Register business routes
  app.post('/business', validationMiddleware, registerBusiness);

  // Register config routes
  app.get('/config/countries/:countryCode/regions', fetchRegionsByCountryId);
};

module.exports = initRoutes;
