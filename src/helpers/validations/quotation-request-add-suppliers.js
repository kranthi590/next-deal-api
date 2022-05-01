const Joi = require('joi');

const quotationRequestAddSuppliersSchema = Joi.object()
  .keys({
    suppliers: Joi.array().items(Joi.number().required()).required(),
  })
  .unknown();

module.exports = { quotationRequestAddSuppliersSchema };
