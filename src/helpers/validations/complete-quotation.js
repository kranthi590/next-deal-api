const Joi = require('joi');

const completeQuotationSchema = Joi.object().keys({
  purchaseOrderNumber: Joi.string().required(),
}).unknown();

module.exports = { completeQuotationSchema };
