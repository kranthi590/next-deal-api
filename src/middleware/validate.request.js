const getValidationSchema = require('../helpers/validations');
const { BadRequestResponse } = require('../helpers/response.transforms');

const validate = async (req, res, next) => {
  try {
    const schema = getValidationSchema(req.originalUrl);
    schema.unknown();
    await schema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    const response = BadRequestResponse(error.details, req.traceId, 'Validation errors');
    res.status(response.status).json(response);
  }
};

module.exports = validate;
