const { supplierSchema, externalSupplierSchemaV2, userSupplierSchemaV2 } = require('./register-supplier');
const { buyerSchema } = require('./register-buyer');
const { userSchema } = require('./register-user');
const { loginUserSchema } = require('./login-user');
const { projectCreationSchema } = require('./project-create');
const { createQuotationRequestSchema } = require('./quotation-request-create');
const { createQuotationResponseSchema } = require('./quotation-response-create');
const { confirmReceptionQuotationSchema } = require('./confirm-reception');
const { createCustomActivitySchema } = require('./create-custom-activity');
const { calendarDataSchema } = require('./fetch-calendar-data');
const { extendBuyerRegistrationSchema } = require('./extend-buyer-registration');
const { commonQuotationUpdateSchema } = require('./quotation-update-common');
const { projectUpdateSchema } = require('./project-update');
const { quotationRequestAddSuppliersSchema } = require('./quotation-request-add-suppliers');

const getValidationSchema = (routePath, method) => {
  switch (true) {
    case routePath === '/api/v2/suppliers':
      return externalSupplierSchemaV2;
    case /^\/api\/v2\/buyers\/\d+\/suppliers$/.test(routePath):
      return userSupplierSchemaV2;
    case routePath === '/api/v1/suppliers':
      return supplierSchema;
    case routePath === '/api/v1/buyers':
      return buyerSchema;
    case routePath === '/api/v1/users':
      return userSchema;
    case routePath === '/api/v1/users/login':
      return loginUserSchema;
    case (routePath === '/api/v1/projects' && method.toLowerCase() === 'post'):
      return projectCreationSchema;
    case (routePath === '/api/v1/projects' && method.toLowerCase() === 'patch'):
      return projectUpdateSchema;
    case routePath === '/api/v1/activities':
      return createCustomActivitySchema;
    case routePath === '/api/v1/calender/validityDates':
      return calendarDataSchema;
    case routePath === '/api/v1/calender/deliveryDates':
      return calendarDataSchema;
    case routePath === '/api/v1/buyers/extendRegistration':
      return extendBuyerRegistrationSchema;
    case /^\/api\/v1\/projects\/\d+\/quotations$/.test(routePath):
      return createQuotationRequestSchema;
    case /^\/api\/v1\/quotations\/\d+\/responses$/.test(routePath):
      return createQuotationResponseSchema;
    case /^\/api\/v1\/buyers\/\d+\/suppliers$/.test(routePath):
      return supplierSchema;
    case /^\/api\/v1\/quotations\/\d+\/complete$/.test(routePath):
      return confirmReceptionQuotationSchema;
    case /^\/api\/v1\/quotations\/\d+\/retain$/.test(routePath):
    case /^\/api\/v1\/quotations\/\d+\/award$/.test(routePath):
      return commonQuotationUpdateSchema;
    case /^\/api\/v1\/quotations\/\d+\/assignSuppliers$/.test(routePath):
      return quotationRequestAddSuppliersSchema;
    default:
      throw new Error('NO_SCHEMA');
  }
};

module.exports = getValidationSchema;
