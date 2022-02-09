const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');
const { OkResponse } = require('../../../helpers/response.transforms');
const { fetchQuotationsByDatesAndBuyer, DATE_FIELD_TYPES } = require('./common.calendar.dates');

const validityDatesHandler = async (req, res) => {
  let response;
  try {
    const {
      startDate,
      endDate,
    } = req.query;
    const quotations = await fetchQuotationsByDatesAndBuyer({
      buyerId: req.user.buyerId,
      dataField: DATE_FIELD_TYPES.VALIDITY_DATE_TYPE,
      startDate,
      endDate,
    });
    response = OkResponse(quotations, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while fetching calendar validity dates', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  validityDatesHandler,
};
