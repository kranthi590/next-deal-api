const moment = require('moment');

const { createBucket } = require('../../../helpers/bucket.utils');
const { BUYER_DOMAIN_BUCKET_FORMAT } = require('../../../helpers/constants');
const { Buyers } = require('../../../helpers/db.models/buyer.model');
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
  businessAddress,
}) => {
  const buyer = await Buyers.create(
    {
      status: BuyerStatuses.ACTIVE,
      licensedUntil: moment().add(30, 'days').utc().format('YYYY-MM-DD HH:mm:ss'),
      businessAddress,
      fantasyName,
      legalName,
      rut,
      webSiteUrl,
      emailId,
      subDomainName: subDomainName.toLowerCase(),
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
    await createBucket(
      BUYER_DOMAIN_BUCKET_FORMAT.replace('subdomain', `${buyer.subDomainName}-${buyer.id}`),
    );
    response = ResourceCreatedResponse(buyer, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while registering buyer', error);
  }
  res.status(response.status).json(response);
};

module.exports = { registerBuyerHandler, BuyerStatuses };
