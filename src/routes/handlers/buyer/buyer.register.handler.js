const moment = require('moment');

const { Buyer } = require('../../../helpers/db.models/buyer.model');
const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');

const { ResourceCreatedResponse } = require('../../../helpers/response.transforms');

const BuyerStatuses = {
  ACTIVE: 'active',
  IN_ACTIVE: 'inactive',
  SUSPENDED: 'suspended',
};

const saveBuyerWithMappings = async ({
  fantasyName,
  legalName,
  rut,
  webSiteUrl,
  emailId,
  subDomainName,
  additionalData,
  contactInfo,
}) => {
  const buyer = await Buyer.create(
    {
      status: BuyerStatuses.ACTIVE,
      licensedUntil: moment().add(30, 'days').utc().format('YYYY-MM-DD HH:mm:ss'),
      businessAddress: contactInfo,
      fantasyName,
      legalName,
      rut,
      webSiteUrl,
      emailId,
      subDomainName,
      additionalData,
    },
    {
      include: ['businessAddress'],
    },
  );
  return {
    ...buyer.dataValues,
  };
};

const registerBuyerHandler = async (req, res) => {
  let response;
  try {
    const buyer = await saveBuyerWithMappings(req.body);
    response = ResourceCreatedResponse(buyer, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while registering buyer', error);
  }
  res.status(response.status).json(response);
};

module.exports = { registerBuyerHandler, BuyerStatuses };
