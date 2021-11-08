const { Countries } = require('../../../helpers/db.models');

const logger = require('../../../helpers/logger');
const {
  OkResponse,
  InternalServerErrorResponse,
} = require('../../../helpers/response.transforms');

const excludeFields = ['active', 'created_at', 'updated_at', 'description'];

const fetchRegionsByCountryCode = async (req, res) => {
  let response;
  try {
    const { countryCode } = req.params;
    const query = {
      include: ['regions'],
      where: {
        code: countryCode,
      },
      attributes: {},
    };
    if (excludeFields) {
      query.attributes.exclude = excludeFields;
    }
    const dbResponse = await Countries.findOne(query);
    response = OkResponse(dbResponse, req.traceId);
  } catch (error) {
    response = InternalServerErrorResponse('', req.traceId);
    logger.error('Error while fetching country by code', error);
  }
  res.status(response.status).json(response);
};

module.exports = fetchRegionsByCountryCode;
