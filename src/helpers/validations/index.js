const { supplierSchema } = require('./register-supplier');
const { buyerSchema } = require('./register-buyer');
const { userSchema } = require('./register-user');
const { loginUserSchema } = require('./login-user');
const { projectCreationSchema } = require('./project-create');

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
    case /^\/api\/v1\/buyers\/\d+\/projects/.test(routePath):
      return projectCreationSchema;
    default:
      throw new Error('NO_SCHEMA');
  }
};

module.exports = getValidationSchema;
