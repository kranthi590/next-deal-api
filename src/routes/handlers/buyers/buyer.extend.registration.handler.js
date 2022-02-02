const moment = require('moment');
const { INVALID_BUYER_ID, INVALID_DATE } = require('../../../helpers/constants');
const { Buyers } = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');
const { getConnection } = require('../../../helpers/mysql');
const { OkResponse } = require('../../../helpers/response.transforms');
const { getBuyer } = require('./buyer.get.handler');

const updateBuyer = async ({
  buyerId,
  licensedUntil,
}) => getConnection().transaction(async (t) => {
  await Buyers.update(
    { licensedUntil },
    {
      where: { id: buyerId },
      transaction: t,
      returning: true,
    },
  );
});

const extendRegistrationBuyerHandler = async (req, res) => {
  let response;
  try {
    const {
      buyerId,
      licensedUntil,
    } = req.body;
    if (moment(licensedUntil, 'DD-MM-YYYY').isBefore(moment())) {
      throw new Error(INVALID_DATE);
    }
    const buyer = await getBuyer(buyerId);
    if (!buyer) {
      throw new Error(INVALID_BUYER_ID);
    }
    await updateBuyer({
      buyerId: buyer.id,
      licensedUntil: moment(licensedUntil, 'DD-MM-YYYY').utc().format('YYYY-MM-DD HH:mm:ss'),
    });
    response = OkResponse({}, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while extending buyer registration', error);
  }
  res.status(response.status).json(response);
};

module.exports = { extendRegistrationBuyerHandler };
