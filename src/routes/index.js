const responseBuilder = require('../helpers/api.response');
const registerBuyerRoutes = require('./buyer.routes');

const initRoutes = (app) => {
  app.get(['/', '/health'], (req, res) => {
    const response = responseBuilder(200, 'OK Response');
    res.status(response.status).json(response);
  });

  // Register buyer routes
  app.use('/buyer', registerBuyerRoutes);
};

module.exports = initRoutes;
