const Joi = require('joi');

const userSchema = Joi.object().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  emailId: Joi.string().email().required(),
  password: Joi.string().required(),
  additionalData: Joi.string(),
  type: Joi.string().required(),
  supplierId: Joi.number(),
}).unknown();

module.exports = { userSchema };
