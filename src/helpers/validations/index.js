const { supplierSchema } = require('./register-supplier');
const { buyerSchema } = require('./register-buyer');
const { userSchema } = require('./register-user');
const { loginUserSchema } = require('./login-user');
const { projectCreationSchema } = require('./project-create');

const getValidationSchema = (routePath) => {
  switch (routePath) {
    case '/supplier/register':
      return supplierSchema;
    case '/buyer/register':
      return buyerSchema;
    case '/user/register':
      return userSchema;
    case '/user/login':
      return loginUserSchema;
    case '/project/create':
      return projectCreationSchema;
    default:
      return {};
  }
};

module.exports = getValidationSchema;
