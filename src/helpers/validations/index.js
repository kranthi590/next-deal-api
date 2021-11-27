const { supplierSchema } = require('./register-supplier');
const { buyerSchema } = require('./register-buyer');
const { userSchema } = require('./register-user');
const { loginUserSchema } = require('./login-user');
const { projectCreationSchema } = require('./project-create');
const { createQuotationRequestSchema } = require('./quotation-request-create');
const { createQuotationResponseSchema } = require('./quotation-response-create');
const { completeQuotationSchema } = require('./complete-quotation');

const getValidationSchema = (routePath) => {
  switch (true) {
    case routePath === '/api/v1/suppliers':
      return supplierSchema;
    case routePath === '/api/v1/buyers':
      return buyerSchema;
    case routePath === '/api/v1/users':
      return userSchema;
    case routePath === '/api/v1/users/login':
      return loginUserSchema;
    case routePath === '/api/v1/projects':
      return projectCreationSchema;
    case /^\/api\/v1\/projects\/\d+\/quotations$/.test(routePath):
      return createQuotationRequestSchema;
    case /^\/api\/v1\/quotations\/\d+\/responses$/.test(routePath):
      return createQuotationResponseSchema;
    case /^\/api\/v1\/buyers\/\d+\/suppliers$/.test(routePath):
      return supplierSchema;
    case /^\/api\/v1\/quotations\/\d+\/complete$/.test(routePath):
      return completeQuotationSchema;
    default:
      throw new Error('NO_SCHEMA');
  }
};

module.exports = getValidationSchema;
