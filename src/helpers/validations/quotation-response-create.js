const Joi = require('joi');
const { CURRENCY_TYPE } = require('../constants');

const createQuotationResponseSchema = Joi.object()
  .keys({
    supplierId: Joi.number().required(),
    netWorth: Joi.number().required(),
    currency: Joi.string().valid(CURRENCY_TYPE.CLP, CURRENCY_TYPE.CL_UF).required(),
    includesTax: Joi.boolean().required(),
    incoterm: Joi.string().required(),
    paymentCondition: Joi.string().required(),
    deliveryDate: Joi.date().required(),
    validityDate: Joi.date().required(),
    description: Joi.string(),
    comments: Joi.string(),
  })
  .unknown();

module.exports = { createQuotationResponseSchema };
