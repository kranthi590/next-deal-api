const Joi = require('joi');

const commonQuotationUpdateSchema = Joi.object().keys({
  comments: Joi.string().optional(),
}).unknown();

module.exports = { commonQuotationUpdateSchema };
