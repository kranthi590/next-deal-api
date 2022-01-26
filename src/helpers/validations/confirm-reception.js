const Joi = require('joi');

const confirmReceptionQuotationSchema = Joi.object().keys({
  purchaseOrderNumber: Joi.string().required(),
}).unknown();

module.exports = { confirmReceptionQuotationSchema };
