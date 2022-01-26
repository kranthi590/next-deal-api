const logger = require('../../../helpers/logger');

const {
  Suppliers, SupplierCategoryMappings, SupplierServiceLocationsMappings, Addresses,
} = require('../../../helpers/db.models');
const { InternalServerErrorResponse, ForbiddenResponse } = require('../../../helpers/response.transforms');
const { INVALID_BUYER_ID } = require('../../../helpers/constants');

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
    businessAddress: {
      addressLine1,
      addressLine2,
      addressLine3,
      region,
      phoneNumber1,
      phoneNumber2,
      comuna,
    },
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
      businessAddress: `${addressLine1}, ${addressLine2}, ${addressLine3 || ''}, ${comuna.name}, ${region.description}`,
      businessPhoneNumber1: phoneNumber1,
      businessPhoneNumber2: phoneNumber2,
      serviceLocations: serviceLocationsArray.join(','),
      categories: categoriesArray.join(','),
    };
  });
  return {
    columns: [
      { header: 'Rut', key: 'rut', width: 5 },
      { header: 'Legal Name', key: 'legalName', width: 25 },
      { header: 'Fantasy Name', key: 'fantasyName', width: 25 },
      { header: 'Web Site', key: 'webSiteUrl', width: 10 },
      { header: 'Is Shared?', key: 'isShared', width: 10 },
      { header: 'Type', key: 'type', width: 10 },
      { header: 'Email Id', key: 'webSiteUrl', width: 10 },
      { header: 'Incharge Full Name', key: 'inchargeFullName', width: 10 },
      { header: 'Incharge Role', key: 'inchargeRole', width: 10 },
      { header: 'Additional Data', key: 'additionalData', width: 25 },
      { header: 'Business Address', key: 'businessAddress', width: 25 },
      { header: 'Business Phone1', key: 'businessPhoneNumber2', width: 25 },
      { header: 'Business Phone2', key: 'additionalData', width: 25 },
      { header: 'Service Locations', key: 'serviceLocations', width: 25 },
      { header: 'Categories', key: 'categories', width: 25 },
    ],
    rows,
  };
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
          'businessAddress',
          {
            model: Addresses,
            as: 'businessAddress',
            include: ['region', 'comuna'],
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
      const {
        columns,
        rows,
      } = transformToExcel(suppliers);
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
};
