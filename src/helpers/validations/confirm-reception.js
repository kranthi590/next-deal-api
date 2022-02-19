const Joi = require('joi');

const confirmReceptionQuotationSchema = Joi.object().keys({
  purchaseOrderNumber: Joi.string().required(),
  comments: Joi.string().allow(null),
}).unknown();

module.exports = { confirmReceptionQuotationSchema };
