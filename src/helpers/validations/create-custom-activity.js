const Joi = require('joi');

const createCustomActivitySchema = Joi.object().keys({
  activityText: Joi.string().required(),
  quotationRequestId: Joi.number().required(),
}).unknown();

module.exports = { createCustomActivitySchema };
