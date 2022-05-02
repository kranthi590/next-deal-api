const Joi = require('joi');

const confirmReceptionQuotationSchema = Joi.object().keys({
  purchaseOrderNumber: Joi.string().allow('').allow(null),
  comments: Joi.string().allow('').allow(null),
  deliveryDate: Joi.date().required(),
}).unknown();

module.exports = { confirmReceptionQuotationSchema };
