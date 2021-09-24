const authenticateCustomerSchema = require('./authenticate-customer.json');
const registerCustomerSchema = require('./register-customer.json');

const getValidationSchema = (routePath) => {
  switch (routePath) {
    case '/customer/authenticate':
      return authenticateCustomerSchema;
    case '/customer/register':
      return registerCustomerSchema;
    default:
      return {};
  }
};

module.exports = getValidationSchema;
