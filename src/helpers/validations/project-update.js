const Joi = require('joi');

const projectUpdateSchema = Joi.object()
  .keys({
    id: Joi.number().required(),
    managerName: Joi.string(),
    name: Joi.string(),
    expectedEndDate: Joi.date(),
    costCenter: Joi.string(),
    description: Joi.string(),
  })
  .unknown();

module.exports = { projectUpdateSchema };
