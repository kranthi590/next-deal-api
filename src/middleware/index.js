const validate = require('./validate.request');
const validateBuyer = require('./validate.buyer');
const auth = require('./auth');
const verifyDomain = require('./validate.domain');
const multerUploadMiddleware = require('./multer');
const verifyApiKey = require('./auth.internal');

module.exports = {
  validateMiddleware: validate,
  validateBuyerMiddleware: validateBuyer,
  authMiddleware: auth,
  verifyDomainMiddleware: verifyDomain,
  multerUploadMiddleware,
  verifyApiKey,
};
