const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const { logger } = require('../helpers/logger');
const responseBuilder = require('../helpers/api.response');
const getValidationSchema = require('../helpers/validations');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
require('ajv-errors')(ajv /* , {singleError: true} */);

const validate = (req, res, next) => {
  try {
    const valid = ajv.validate(getValidationSchema(req.originalUrl),
      { ...req.query, ...req.params, ...req.body });
    if (!valid) {
      const validationErrors = ajv.errors;
      const resp = responseBuilder(400, 'Validation errors', {
        validationErrors,
      }, req.traceId);
      res.status(resp.status).json(resp);
    } else {
      next();
    }
  } catch (error) {
    logger.error(error);
    const resp = responseBuilder(500, 'Internal server error', req.traceId);
    res.status(resp.status).json(resp);
  }
};

module.exports = validate;
