const { supplierSchema } = require('./register-supplier');
const { buyerSchema } = require('./register-buyer');
const { userSchema } = require('./register-user');
const { loginUserSchema } = require('./login-user');
const { projectCreationSchema } = require('./project-create');

const getValidationSchema = (routePath) => {
  switch (routePath) {
    case '/api/v1/suppliers':
      return supplierSchema;
    case '/api/v1/buyers':
      return buyerSchema;
    case '/api/v1/users':
      return userSchema;
    case '/api/v1/users/login':
      return loginUserSchema;
    case '/api/v1/projects':
      return projectCreationSchema;
    default:
      throw new Error('NO_SCHEMA');
  }
};

module.exports = getValidationSchema;
