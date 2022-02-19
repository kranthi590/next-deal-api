const Joi = require('joi');

const commonQuotationUpdateSchema = Joi.object().keys({
  comments: Joi.string().allow(null),
}).unknown();

module.exports = { commonQuotationUpdateSchema };
