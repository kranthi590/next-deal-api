const Joi = require('joi');
const { Address } = require('./register-supplier');

const buyerSchema = Joi.object().keys({
  fantasyName: Joi.string().required(),
  legalName: Joi.string().required(),
  rut: Joi.string().required(),
  webSiteUrl: Joi.string(),
  emailId: Joi.string().email().required(),
  subDomainName: Joi.string().required(),
  contactInfo: Address,
  additionalData: Joi.string(),
}).unknown();

module.exports = { buyerSchema };
