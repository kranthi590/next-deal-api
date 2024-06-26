const Joi = require('joi');
const { CURRENCY_TYPE } = require('../constants');

const projectCreationSchema = Joi.object()
  .keys({
    name: Joi.string().required(),
    managerName: Joi.string().required(),
    startDate: Joi.date().required(),
    expectedEndDate: Joi.date(),
    costCenter: Joi.string(),
    estimatedBudget: Joi.number().allow(null),
    currency: Joi.string().valid(
      CURRENCY_TYPE.CLP, CURRENCY_TYPE.CL_UF, CURRENCY_TYPE.USD,
    ).required(),
    description: Joi.string().allow('').allow(null),
  })
  .unknown();

module.exports = { projectCreationSchema };
