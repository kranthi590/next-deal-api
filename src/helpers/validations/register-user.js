const Joi = require('joi');
const { Address } = require('./register-supplier');

const userSchema = Joi.object().keys({
  contactInfo: Address,
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  emailId: Joi.string().email().required(),
  password: Joi.string().required(),
  additionalData: Joi.string(),
  type: Joi.string().required(),
  buyerId: Joi.number(),
  supplierId: Joi.number(),
}).unknown();

module.exports = { userSchema };
