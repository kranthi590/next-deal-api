const { supplierSchema } = require('./register-supplier');

const getValidationSchema = (routePath) => {
  switch (routePath) {
    case '/supplier/register':
      return supplierSchema;
    default:
      return {};
  }
};

module.exports = getValidationSchema;
