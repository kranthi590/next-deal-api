const Joi = require('joi');
const {
  CURRENCY_TYPE,
} = require('../constants');

const inProgressOrCreatedSchema = {
  netWorth: Joi.number().required(),
  currency: Joi.string().valid(
    CURRENCY_TYPE.CLP, CURRENCY_TYPE.CL_UF, CURRENCY_TYPE.USD,
  ).required(),
  includesTax: Joi.boolean().required(),
  incoterm: Joi.string().required(),
  paymentCondition: Joi.string().required(),
  deliveryDate: Joi.date().required(),
  validityDate: Joi.date().required(),
  comments: Joi.string().allow('').allow(null),
};

const awardedQuotationSchema = {
  purchaseOrderNumber: Joi.string().allow('').allow(null),
  deliveryDate: Joi.date().required(),
  comments: Joi.string().allow('').allow(null),
};

module.exports = { inProgressOrCreatedSchema, awardedQuotationSchema };
