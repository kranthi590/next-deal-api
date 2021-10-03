const express = require('express');
const logger = require('../helpers/logger');
const { OkResponse, InternalServerErrorResponse, NotFoundResponse } = require('../helpers/responseTransforms');
const { fetchCountryByCode, fetchRegionsByCountryId } = require('../services');

const router = express.Router();

router.get('/countries/:countryCode/regions', async (req, res) => {
  let response;
  try {
    const country = await fetchCountryByCode(req.params.countryCode,
      ['active', 'created_at', 'updated_at', 'description']);
    if (country) {
      response = OkResponse(country, req.traceId);
      country.regions = await fetchRegionsByCountryId(country.id);
    } else {
      response = NotFoundResponse(null, req.traceId);
    }
  } catch (error) {
    response = InternalServerErrorResponse('', req.traceId);
    logger.error(`Error while fetching country by code ${error}`);
  }
  res.status(response.status).json(response);
});

module.exports = router;
