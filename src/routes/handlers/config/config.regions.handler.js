const { Countries } = require('../../../helpers/db.models');

console.log('Countries', Countries);
const logger = require('../../../helpers/logger');
const {
  NotFoundResponse,
  OkResponse,
  InternalServerErrorResponse,
} = require('../../../helpers/response.transforms');

const excludeFields = ['active', 'created_at', 'updated_at', 'description'];

const fetchRegionsByCountryCode = async (req, res) => {
  let response;
  try {
    const { countryCode } = req.params;
    const query = {
      include: ['region'],
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
    const dbResponse = await Countries.findAll(query);
    if (dbResponse.lenth > 0) {
      response = NotFoundResponse(null, req.traceId);
    } else {
      const { id, name, code } = dbResponse[0];
      response = OkResponse(
        {
          id,
          name,
          code,
          regions: dbResponse.map((object) => object.region),
        },
        req.traceId,
      );
    }
  } catch (error) {
    response = InternalServerErrorResponse('', req.traceId);
    logger.error(`Error while fetching country by code ${error}`);
  }
  res.status(response.status).json(response);
};

module.exports = fetchRegionsByCountryCode;
