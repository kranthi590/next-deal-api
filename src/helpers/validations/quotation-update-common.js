const Joi = require('joi');

const commonQuotationUpdateSchema = Joi.object().keys({
  comments: Joi.string().allow('').allow(null),
}).unknown();

module.exports = { commonQuotationUpdateSchema };
