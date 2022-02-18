const Joi = require('joi');

const confirmReceptionQuotationSchema = Joi.object().keys({
  purchaseOrderNumber: Joi.string().required(),
  comments: Joi.string(),
}).unknown();

module.exports = { confirmReceptionQuotationSchema };
