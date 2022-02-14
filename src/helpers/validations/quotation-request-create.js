const Joi = require('joi');
const { CURRENCY_TYPE } = require('../constants');

const createQuotationRequestSchema = Joi.object()
  .keys({
    name: Joi.string().required(),
    startDate: Joi.date().required(),
    expectedEndDate: Joi.date(),
    estimatedBudget: Joi.number().required(),
    currency: Joi.string().valid(
      CURRENCY_TYPE.CLP, CURRENCY_TYPE.CL_UF, CURRENCY_TYPE.USD,
    ).required(),
    comments: Joi.string().required(),
    suppliers: Joi.array().items(Joi.number().required()).required(),
  })
  .unknown();

module.exports = { createQuotationRequestSchema };
