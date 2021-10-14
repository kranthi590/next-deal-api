const Joi = require('joi');

const addressSchema = Joi.object().keys({
  contactFirstName: Joi.string(),
  contactLastName: Joi.string(),
  emailId: Joi.string().email(),
  role: Joi.string(),
  addressLine1: Joi.string(),
  addressLine2: Joi.string(),
  addressLine3: Joi.string(),
  communeId: Joi.number(),
  regionId: Joi.number(),
  countryId: Joi.number(),
  phoneNum1: Joi.string(),
  phoneNum2: Joi.string(),
  additionalData: Joi.string(),
}).required();

const businessSchema = Joi.object().keys({
  fantasyName: Joi.string().required(),
  businessName: Joi.string().required(),
  rut: Joi.string().required(),
  webSite: Joi.string(),
  emailId: Joi.string().email().required(),
  domainName: Joi.string().required(),
  categories: Joi.array().items(Joi.number().required()),
  businessAddress: addressSchema,
  billingAddress: addressSchema,
  businessType: Joi.string().valid('buyer', 'seller').required(),
});

module.exports = businessSchema;
