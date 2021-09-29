const express = require('express');
const { Countries, Regions } = require('../helpers/db.models');
const logger = require('../helpers/logger');
const { OkResponse, InternalServerErrorResponse, NotFoundResponse } = require('../helpers/responseTransforms');

const router = express.Router();

const fetchCountyByCode = async (countryCode, excludeFields) => {
  const query = {
    where: {
      active: 1,
      code: countryCode,
    },
    attributes: {},
    raw: true,
    nest: true,
  };
  if (excludeFields) {
    query.attributes.exclude = excludeFields;
  }
  return Countries.findOne(query);
};

const fetchRegionsByCountryId = async (countryId, excludeFields) => {
  const query = {
    where: {
      country_id: countryId,
    },
    attributes: {},
    raw: true,
    nest: true,
  };
  if (excludeFields) {
    query.attributes.exclude = excludeFields;
  }
  return Regions.findAll(query);
};

router.get('/countries/:countryCode', async (req, res) => {
  let response;
  try {
    const country = await fetchCountyByCode(req.params.countryCode,
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
