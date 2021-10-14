const Joi = require('joi');

const addressSchema = Joi.object()
  .keys({
    addressLine1: Joi.string().required(),
    addressLine2: Joi.string().required(),
    addressLine3: Joi.string(),
    communeId: Joi.number().required(),
    regionId: Joi.number().required(),
    countryId: Joi.number().required(),
    phoneNumber1: Joi.string().required(),
    phoneNumber2: Joi.string(),
    emailId: Joi.string().email().required(),
  })
  .required();

const buyerSchema = Joi.object().keys({
  fantasyName: Joi.string().required(),
  legalName: Joi.string().required(),
  rut: Joi.string().required(),
  webSiteUrl: Joi.string(),
  emailId: Joi.string().email().required(),
  subDomainName: Joi.string().required(),
  contactInfo: addressSchema,
  additionalData: Joi.string(),
});

module.exports = { buyerSchema };
