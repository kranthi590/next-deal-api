const logger = require('../helpers/logger');
const { fetchCountryByCode } = require('../helpers/services/countries.service');
const { OkResponse, NotFoundResponse, InternalServerErrorResponse } = require('../helpers/response.transforms');

const fetchRegionsByCountryId = async (req, res) => {
  let response;
  try {
    const country = await fetchCountryByCode(req.params.countryCode,
      ['active', 'created_at', 'updated_at', 'description']);
    if (country) {
      response = OkResponse(country, req.traceId);
    } else {
      response = NotFoundResponse(null, req.traceId);
    }
  } catch (error) {
    response = InternalServerErrorResponse('', req.traceId);
    logger.error(`Error while fetching country by code ${error}`);
  }
  res.status(response.status).json(response);
};

module.exports = {
  fetchRegionsByCountryId,
};
