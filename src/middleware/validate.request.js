const url = require('url');

const getValidationSchema = require('../helpers/validations');
const { BadRequestResponse } = require('../helpers/response.transforms');
const logger = require('../helpers/logger');

const validate = async (req, res, next) => {
  try {
    const schema = getValidationSchema(url.parse(req.originalUrl).pathname, req.method);
    schema.unknown();
    console.log(req.query);
    await schema.validateAsync({ ...req.body, ...req.query }, { abortEarly: false });
    next();
  } catch (error) {
    logger.error('Error while validating request', error);
    const response = BadRequestResponse(error.details, req.traceId, 'Validation errors');
    res.status(response.status).json(response);
  }
};

module.exports = validate;
