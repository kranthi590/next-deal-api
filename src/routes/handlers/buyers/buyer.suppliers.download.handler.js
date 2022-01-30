const logger = require('../../../helpers/logger');

const {
  Suppliers, SupplierCategoryMappings, SupplierServiceLocationsMappings, Addresses,
} = require('../../../helpers/db.models');
const { InternalServerErrorResponse, ForbiddenResponse } = require('../../../helpers/response.transforms');
const { INVALID_BUYER_ID } = require('../../../helpers/constants');

const columns = [
  { header: 'Rut *', key: 'rut', width: 25 },
  { header: 'Legal Name *', key: 'legalName', width: 25 },
  { header: 'Fantasy Name *', key: 'fantasyName', width: 25 },
  { header: 'Web Site', key: 'webSiteUrl', width: 50 },
  { header: 'Logo URL *', key: 'logoUrl', width: 50 },
  { header: 'Is Shared? *', key: 'isShared', width: 5 },
  { header: 'Type *', key: 'type', width: 25 },
  { header: 'Email Id *', key: 'emailId', width: 25 },
  { header: 'Incharge Full Name', key: 'inchargeFullName', width: 25 },
  { header: 'Incharge Role', key: 'inchargeRole', width: 25 },
  { header: 'Additional Data', key: 'additionalData', width: 100 },
  { header: 'Service Locations *', key: 'serviceLocations', width: 100 },
  { header: 'Categories *', key: 'categories', width: 100 },

  { header: 'Business Address Line 1', key: 'businessAddressLine1', width: 25 },
  { header: 'Business Address Line 2', key: 'businessAddressLine2', width: 25 },
  { header: 'Business Address Line 3 ', key: 'businessAddressLine3', width: 25 },
  { header: 'Business Address Comuna', key: 'businessAddressComuna', width: 25 },
  { header: 'Business Address Region', key: 'businessAddressRegion', width: 25 },
  { header: 'Business Address Country', key: 'businessAddressCountry', width: 25 },
  { header: 'Business Address Phone 1', key: 'businessPhoneNumber1', width: 25 },
  { header: 'Business Address Phone 2', key: 'businessPhoneNumber2', width: 25 },

  { header: 'Contact Info Address Line 1', key: 'contactInfoLine1', width: 25 },
  { header: 'Contact Info Address Line 2', key: 'contactInfoLine2', width: 25 },
  { header: 'Contact Info Address Line 3 ', key: 'contactInfoLine3', width: 25 },
  { header: 'Contact Info Address Comuna', key: 'contactInfoComuna', width: 25 },
  { header: 'Contact Info Address Region', key: 'contactInfoRegion', width: 25 },
  { header: 'Contact Info Address Country', key: 'contactInfoCountry', width: 25 },
  { header: 'Contact Info Address Phone 1', key: 'contactInfoPhoneNumber1', width: 25 },
  { header: 'Contact Info Address Phone 2', key: 'contactInfoPhoneNumber2', width: 25 },

  { header: 'Billing Address Line 1', key: 'billingAddressLine1', width: 25 },
  { header: 'Billing Address Line 2', key: 'billingAddressLine2', width: 25 },
  { header: 'Billing Address Line 3 ', key: 'billingAddressLine3', width: 25 },
  { header: 'Billing Address Comuna', key: 'billingAddressComuna', width: 25 },
  { header: 'Billing Address Region', key: 'billingAddressRegion', width: 25 },
  { header: 'Billing Address Country', key: 'billingAddressCountry', width: 25 },
  { header: 'Billing Address Phone 1', key: 'billingAddressPhoneNumber1', width: 25 },
  { header: 'Billing Address Phone 2', key: 'billingAddressPhoneNumber2', width: 25 },
];

const transformToExcel = (data) => {
  const rows = data.map(({
    buyerId,
    rut,
    legalName,
    fantasyName,
    webSiteUrl,
    logoUrl,
    isShared,
    type,
    emailId,
    inchargeFullName,
    inchargeRole,
    additionalData,
    businessAddress,
    contactInfo,
    billingAddress,
    serviceLocations,
    categories,
  }) => {
    // eslint-disable-next-line max-len
    const serviceLocationsArray = serviceLocations.map(({ region: { description } }) => description);
    const categoriesArray = categories.map(({ category: { name } }) => name);
    return {
      buyerId,
      rut,
      legalName,
      fantasyName,
      webSiteUrl,
      logoUrl,
      isShared,
      type,
      emailId,
      inchargeFullName,
      inchargeRole,
      additionalData,

      businessAddressLine1: businessAddress ? businessAddress.addressLine1 : '',
      businessAddressLine2: businessAddress ? businessAddress.addressLine2 : '',
      businessAddressLine3: businessAddress ? businessAddress.addressLine3 : '',
      businessAddressComuna: businessAddress ? businessAddress.comuna.name : '',
      businessAddressRegion: businessAddress ? businessAddress.region.description : '',
      businessAddressCountry: businessAddress ? businessAddress.country.name : '',
      businessPhoneNumber1: businessAddress ? businessAddress.phoneNumber1 : '',
      businessPhoneNumber2: businessAddress ? businessAddress.phoneNumber2 : '',

      contactInfoLine1: contactInfo ? contactInfo.addressLine1 : '',
      contactInfoLine2: contactInfo ? contactInfo.addressLine2 : '',
      contactInfoLine3: contactInfo ? contactInfo.addressLine3 : '',
      contactInfoComuna: contactInfo ? contactInfo.comuna.name : '',
      contactInfoRegion: contactInfo ? contactInfo.region.description : '',
      contactInfoCountry: contactInfo ? contactInfo.country.name : '',
      contactInfoPhoneNumber1: contactInfo ? contactInfo.phoneNumber1 : '',
      contactInfoPhoneNumber2: contactInfo ? contactInfo.phoneNumber2 : '',

      billingAddressLine1: billingAddress ? billingAddress.addressLine1 : '',
      billingAddressLine2: billingAddress ? billingAddress.addressLine2 : '',
      billingAddressLine3: billingAddress ? billingAddress.addressLine3 : '',
      billingAddressComuna: billingAddress ? billingAddress.comuna.name : '',
      billingAddressRegion: billingAddress ? billingAddress.region.description : '',
      billingAddressCountry: billingAddress ? billingAddress.country.name : '',
      billingAddressPhoneNumber1: billingAddress ? billingAddress.phoneNumber1 : '',
      billingAddressPhoneNumber2: billingAddress ? billingAddress.phoneNumber2 : '',

      serviceLocations: serviceLocationsArray.join(','),
      categories: categoriesArray.join(','),
    };
  });
  return rows;
};

const downloadBuyersSuppliersHandler = async (req, res, next) => {
  let response;
  try {
    if (req.params.buyerId !== req.user.buyerId.toString()) {
      response = ForbiddenResponse(INVALID_BUYER_ID, req.traceId);
    } else {
      const query = {
        where: {
          buyerId: req.user.buyerId,
        },
        include: [
          {
            model: Addresses,
            as: 'businessAddress',
            include: ['region', 'comuna', 'country'],
          },
          {
            model: Addresses,
            as: 'contactInfo',
            include: ['region', 'comuna', 'country'],
          },
          {
            model: Addresses,
            as: 'billingAddress',
            include: ['region', 'comuna', 'country'],
          },
          {
            model: SupplierServiceLocationsMappings,
            as: 'serviceLocations',
            include: ['region'],
          },
          {
            model: SupplierCategoryMappings,
            as: 'categories',
            include: ['category'],
          },
        ],
      };
      const suppliers = await Suppliers.findAll(query);
      const rows = transformToExcel(suppliers);
      req.excelData = {
        columns,
        rows,
        worksheetName: 'Suppliers',
      };
      next();
    }
  } catch (error) {
    response = InternalServerErrorResponse('', req.traceId);
    logger.error('Error while downloading buyers supplier', error);
    res.status(response.status).json(response);
  }
};

module.exports = {
  downloadBuyersSuppliersHandler,
  columns,
};
