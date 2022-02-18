const Joi = require('joi');

const commonQuotationUpdateSchema = Joi.object().keys({
  comments: Joi.string(),
}).unknown();

module.exports = { commonQuotationUpdateSchema };
