const Joi = require('joi');

const BillingAddress = Joi.object().keys({
  addressLine1: Joi.string(),
  addressLine2: Joi.string(),
  communeId: Joi.number(),
  regionId: Joi.number(),
  countryId: Joi.number(),
  phoneNumber1: Joi.string(),
  phoneNumber2: Joi.string(),
  additionalData: Joi.string(),
  emailId: Joi.string().email(),
});

const BusinessAddress = Joi.object().keys({
  addressLine1: Joi.string().required(),
  addressLine2: Joi.string().required(),
  communeId: Joi.number().required(),
  regionId: Joi.number().required(),
  countryId: Joi.number().required(),
  phoneNumber1: Joi.string().required(),
  phoneNumber2: Joi.string(),
  emailId: Joi.string().email().required(),
}).required().unknown();

const supplierSchema = Joi.object().keys({
  fantasyName: Joi.string().required(),
  legalName: Joi.string().required(),
  rut: Joi.string().required(),
  webSiteUrl: Joi.string(),
  emailId: Joi.string().email().required(),
  logoUrl: Joi.string(),
  isShared: Joi.bool().required(),
  inchargeFullName: Joi.string(),
  inchargeRole: Joi.string(),
  categories: Joi.array().items(Joi.number().required()),
  serviceLocations: Joi.array().items(Joi.number().required()),
  inchargeContactInfo: BillingAddress,
  billingAddress: BillingAddress,
  businessAddress: BusinessAddress,
  type: Joi.string().required(),
}).unknown();

module.exports = {
  supplierSchema,
  Address: BusinessAddress,
};
