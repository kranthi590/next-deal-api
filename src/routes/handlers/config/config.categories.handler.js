const { Categories } = require('../../../helpers/db.models');

const logger = require('../../../helpers/logger');
const {
  OkResponse,
  InternalServerErrorResponse,
} = require('../../../helpers/response.transforms');

const fetchAllCategories = async (req, res) => {
  let response;
  try {
    const query = {
      where: {
        active: true,
      },
      attributes: ['name', 'id'],
    };
    const dbResponse = await Categories.findAll(query);
    response = OkResponse(dbResponse, req.traceId);
  } catch (error) {
    response = InternalServerErrorResponse('', req.traceId);
    logger.error('Error while fetching categories', error);
  }
  res.status(response.status).json(response);
};

module.exports = fetchAllCategories;
