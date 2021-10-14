const moment = require('moment');

const { BusinessAddress } = require('../../../helpers/db.models');
const { Buyer } = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');
const { getConnection } = require('../../../helpers/mysql');

const { ResourceCreatedResponse } = require('../../../helpers/response.transforms');

const BuyerStatuses = {
  ACTIVE: 'active',
  IN_ACTIVE: 'inactive',
  SUSPENDED: 'suspended',
};

const saveBuyerWithMappings = async (body) => {
  const result = await getConnection().transaction(async (t) => {
    const businessAddress = await BusinessAddress.create(body.contactInfo, { transaction: t });
    const buyerRequest = { ...body };
    buyerRequest.contactInfoId = businessAddress.dataValues.id;
    buyerRequest.status = BuyerStatuses.ACTIVE;
    buyerRequest.licensedUntil = moment().add(30, 'days').utc().format('YYYY-MM-DD HH:mm:ss');
    const buyer = await Buyer.create(buyerRequest, { transaction: t });
    return {
      ...buyer.dataValues,
      contactInfo: businessAddress.dataValues,
    };
  });
  return result;
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
