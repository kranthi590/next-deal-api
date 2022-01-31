const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');
const { OkResponse } = require('../../../helpers/response.transforms');
const { fetchQuotationsByDatesAndBuyer } = require('./common.calendar.dates');

const validityDatesHandler = async (req, res) => {
  let response;
  try {
    const {
      startDate,
      endDate,
    } = req.body;
    const quotations = await fetchQuotationsByDatesAndBuyer({
      buyerId: req.user.buyerId,
      dataField: 'validityDate',
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
