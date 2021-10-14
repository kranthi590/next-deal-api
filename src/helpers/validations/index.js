const { supplierSchema } = require('./register-supplier');
const { buyerSchema } = require('./register-buyer');

const getValidationSchema = (routePath) => {
  switch (routePath) {
    case '/supplier/register':
      return supplierSchema;
    case '/buyer/register':
      return buyerSchema;
    default:
      return {};
  }
};

module.exports = getValidationSchema;
