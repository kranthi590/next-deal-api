const { Regions, Countries } = require('../../../helpers/db.models');
const logger = require('../../../helpers/logger');
const {
  OkResponse,
  InternalServerErrorResponse,
} = require('../../../helpers/response.transforms');

const excludeFields = ['active', 'created_at', 'updated_at', 'description'];

const fetchComunasByRegion = async (req, res) => {
  let response;
  try {
    const query = {
      include: [
        'comunas',
        {
          model: Countries,
          where: {
            code: req.params.countryCode,
          },
        },
      ],
      where: {
        id: req.params.regionId,
      },
      attributes: {},
    };
    if (excludeFields) {
      query.attributes.exclude = excludeFields;
    }
    const dbResponse = await Regions.findAll(query);
    response = OkResponse(
      dbResponse.map((object) => object.comunas),
      req.traceId,
    );
  } catch (error) {
    response = InternalServerErrorResponse('', req.traceId);
    logger.error('Error while fetching comunas by region', error);
  }
  res.status(response.status).json(response);
};

module.exports = fetchComunasByRegion;
