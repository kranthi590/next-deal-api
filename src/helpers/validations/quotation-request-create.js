const Joi = require('joi');
const { CURRENCY_TYPE } = require('../constants');

const createQuotationRequestSchema = Joi.object()
  .keys({
    name: Joi.string().required(),
    startDate: Joi.date().required(),
    expectedEndDate: Joi.date().required(),
    estimatedBudget: Joi.number(),
    currency: Joi.string().valid(CURRENCY_TYPE.CLP, CURRENCY_TYPE.CL_UF).required(),
    description: Joi.string(),
    comments: Joi.string(),
    suppliers: Joi.array().items(Joi.number().required()).required(),
  })
  .unknown();

module.exports = { createQuotationRequestSchema };
