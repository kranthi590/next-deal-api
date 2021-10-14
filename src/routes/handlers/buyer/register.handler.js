const _ = require('lodash');
const moment = require('moment');

const { BusinessAddress } = require('../../../helpers/db.models');
const { Buyer } = require('../../../helpers/db.models');
const logger = require('../../../helpers/logger');
const { getConnection } = require('../../../helpers/mysql');

const {
  InternalServerErrorResponse,
  ResourceCreatedResponse,
  ConflictResponse,
} = require('../../../helpers/response.transforms');

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
    const errorCode = _.get(error, 'original.code', null);
    const isRutDuplicate = _.get(error, 'fields.rut', false);
    const isDomainDuplicate = _.get(error, 'fields.subdomain_name', false);
    if (errorCode === 'ER_DUP_ENTRY' && isRutDuplicate) {
      response = ConflictResponse('ER_DUP_ENTRY_RUT', req.traceId);
    } else if (errorCode === 'ER_DUP_ENTRY' && isDomainDuplicate) {
      response = ConflictResponse('ER_DUP_ENTRY_SUB_DOMAIN', req.traceId);
    } else {
      response = InternalServerErrorResponse('', req.traceId);
    }
    logger.error('Error while registering supplier', error);
  }
  res.status(response.status).json(response);
};

module.exports = { registerBuyerHandler, BuyerStatuses };
