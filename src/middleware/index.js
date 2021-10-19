const validate = require('./validate.request');
const validateBuyer = require('./validate.buyer');

module.exports = {
  validateMiddleware: validate,
  validateBuyerMiddleware: validateBuyer,
};
