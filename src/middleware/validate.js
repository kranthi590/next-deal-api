const getValidationSchema = require('../helpers/validations');
const { BadRequestResponse } = require('../helpers/response.transforms');

const validate = async (req, res, next) => {
  try {
    console.log('req.originalUrl', req.originalUrl);
    const schema = getValidationSchema(req.originalUrl);
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    const response = BadRequestResponse(error.details, req.traceId, 'Validation errors');
    res.status(response.status).json(response);
  }
};

module.exports = validate;
