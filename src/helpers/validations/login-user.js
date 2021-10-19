const Joi = require('joi');

const loginUserSchema = Joi.object().keys({
  emailId: Joi.string().email().required(),
  password: Joi.string().required(),
}).unknown();

module.exports = { loginUserSchema };
