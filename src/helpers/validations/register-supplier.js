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
  phoneNumber1: Joi.string(),
  phoneNumber2: Joi.string(),
  emailId: Joi.string().email(),
}).required().unknown();

const BusinessAddressV2 = Joi.object().keys({
  addressLine1: Joi.string().required(),
  addressLine2: Joi.string().required(),
  communeId: Joi.number().required(),
  regionId: Joi.number().required(),
  countryId: Joi.number().required(),
  phoneNumber1: Joi.string(),
  phoneNumber2: Joi.string(),
  emailId: Joi.string().email(),
}).required().unknown();

const supplierSchema = Joi.object().keys({
  legalName: Joi.string().required(),
  rut: Joi.string().required(),
  webSiteUrl: Joi.string(),
  emailId: Joi.string().email().required(),
  isShared: Joi.bool().required(),
  inchargeFullName: Joi.string(),
  inchargeRole: Joi.string(),
  categories: Joi.array().items(Joi.number().required()).required(),
  inchargeContactInfo: BillingAddress,
  billingAddress: BillingAddress,
  businessAddress: BusinessAddress,
  comments: Joi.string().allow('').allow(null),
}).unknown();

const supplierSchemaV2 = {
  // Mandatory Fields
  legalName: Joi.string().required(),
  rut: Joi.string().required(),
  categories: Joi.array().items(Joi.number().required()).required(),
  isShared: Joi.bool().required(),

  // Optional Fields
  webSiteUrl: Joi.string(),
  emailId: Joi.string().email().allow(null),
  inchargeFullName: Joi.string(),
  inchargeRole: Joi.string(),
  inchargeContactInfo: BillingAddress,
  billingAddress: BillingAddress,
  comments: Joi.string().allow('').allow(null),

  /* Removed Fields

  fantasyName: Joi.string().required(),
  serviceLocations: Joi.array().items(Joi.number().required()),
  type: Joi.string().required(),
  */
};

const externalSupplierSchemaV2 = Joi.object().keys({
  ...supplierSchemaV2,
  businessAddress: BusinessAddressV2, // Required
}).unknown();

const userSupplierSchemaV2 = Joi.object().keys({
  ...supplierSchemaV2,
  businessAddress: BillingAddress, // Optional
}).unknown();

module.exports = {
  supplierSchema,
  Address: BusinessAddress,
  externalSupplierSchemaV2,
  userSupplierSchemaV2,
  supplierSchemaV2,
};
