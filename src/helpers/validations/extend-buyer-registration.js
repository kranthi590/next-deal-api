const Joi = require('joi');

const extendBuyerRegistrationSchema = Joi.object()
  .keys({
    licensedUntil: Joi.date().required(),
    //  additionalData: Joi.string(),
    buyerId: Joi.number().required(),
  })
  .unknown();

module.exports = { extendBuyerRegistrationSchema };
