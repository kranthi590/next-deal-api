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
  comments: Joi.string(),
};

const awardedQuotationSchema = {
  purchaseOrderNumber: Joi.string().required(),
  deliveryDate: Joi.date().required(),
};

module.exports = { inProgressOrCreatedSchema, awardedQuotationSchema };
