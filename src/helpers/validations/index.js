const { supplierSchema } = require('./register-supplier');
const { buyerSchema } = require('./register-buyer');
const { userSchema } = require('./register-user');

const getValidationSchema = (routePath) => {
  switch (routePath) {
    case '/supplier/register':
      return supplierSchema;
    case '/buyer/register':
      return buyerSchema;
    case '/user/register':
      return userSchema;
    default:
      return {};
  }
};

module.exports = getValidationSchema;
