const registerBusinessSchema = require('./register-business.json');

const getValidationSchema = (routePath) => {
  switch (routePath) {
    case '/business':
      return registerBusinessSchema;
    default:
      return {};
  }
};

module.exports = getValidationSchema;
