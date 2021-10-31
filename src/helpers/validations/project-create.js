const Joi = require('joi');
const { CURRENCY_TYPE } = require('../constants');

const projectCreationSchema = Joi.object()
  .keys({
    name: Joi.string().required(),
    managerName: Joi.string().required(),
    startDate: Joi.date().required(),
    expectedEndDate: Joi.date().required(),
    costCenter: Joi.string().required(),
    estimatedBudget: Joi.number().required(),
    currency: Joi.string().valid(CURRENCY_TYPE.CLP, CURRENCY_TYPE.CL_UF).required(),
    description: Joi.string(),
  })
  .unknown();

module.exports = { projectCreationSchema };
