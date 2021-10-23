const validate = require('./validate.request');
const validateBuyer = require('./validate.buyer');
const auth = require('./auth');
const verifyDomain = require('./validate.domain');

module.exports = {
  validateMiddleware: validate,
  validateBuyerMiddleware: validateBuyer,
  authMiddleware: auth,
  verifyDomainMiddleware: verifyDomain,
};
