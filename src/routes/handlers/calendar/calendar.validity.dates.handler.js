const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');
const { OkResponse } = require('../../../helpers/response.transforms');
const { fetchQuotationsByDatesAndBuyer } = require('./common.calendar.dates');

const validityDatesHandler = async (req, res) => {
  let response;
  try {
    const quotations = await fetchQuotationsByDatesAndBuyer({
      buyerId: req.user.buyerId,
      dataField: 'validityDate',
      startDate: '2022-01-01',
      endDate: '2022-01-31',
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
