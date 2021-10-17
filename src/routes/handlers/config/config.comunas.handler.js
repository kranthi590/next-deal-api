const { Provincias } = require('../../../helpers/db.models/country.model');
const logger = require('../../../helpers/logger');
const {
  NotFoundResponse,
  OkResponse,
  InternalServerErrorResponse,
} = require('../../../helpers/response.transforms');

const excludeFields = ['active', 'created_at', 'updated_at', 'description'];

const fetchComunasByRegion = async (req, res) => {
  let response;
  try {
    const query = {
      include: ['comuna'],
      where: {
        region_id: req.params.regionId,
      },
      attributes: {},
      raw: true,
      nest: true,
    };
    if (excludeFields) {
      query.attributes.exclude = excludeFields;
    }
    const dbResponse = await Provincias.findAll(query);
    if (dbResponse.lenth > 0) {
      response = NotFoundResponse(null, req.traceId);
    } else {
      response = OkResponse(
        dbResponse.map((object) => object.comuna),
        req.traceId,
      );
    }
  } catch (error) {
    response = InternalServerErrorResponse('', req.traceId);
    logger.error(`Error while fetching comunas by region ${error}`);
  }
  res.status(response.status).json(response);
};

module.exports = fetchComunasByRegion;
