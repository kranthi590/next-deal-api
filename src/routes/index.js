const { OkResponse } = require('../helpers/response.transforms');
const { validateMiddleware, validateBuyerMiddleware } = require('../middleware');
const registerSupplier = require('./handlers/supplier/supplier.register.handler');
const fetchRegionsByCountryCode = require('./handlers/config/config.regions.handler');
const fetchComunasByRegion = require('./handlers/config/config.comunas.handler');
const { getSupplierHandler } = require('./handlers/supplier/supplier.get.handler');
const { registerBuyerHandler } = require('./handlers/buyer/buyer.register.handler');
const { getBuyerHandler } = require('./handlers/buyer/buyer.get.handler');
const { registerUserHandler } = require('./handlers/user/user.register.handler');
const { getUserHandler } = require('./handlers/user/user.get.handler');
const { userLoginHandler } = require('./handlers/user/user.login.handler');

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

  // User routes
  app.post('/user/register', validateMiddleware, validateBuyerMiddleware, registerUserHandler);
  app.get('/user/:userId', getUserHandler);
  app.post('/user/login', validateMiddleware, validateBuyerMiddleware, userLoginHandler);

  // Register config routes
  app.get('/config/countries/:countryCode/regions', fetchRegionsByCountryCode);
  app.get('/config/countries/:countryCode/regions/:regionId/comunas', fetchComunasByRegion);
};

module.exports = initRoutes;
