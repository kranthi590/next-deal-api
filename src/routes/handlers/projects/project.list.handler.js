const { Sequelize } = require('sequelize');
const { DB_FETCH_SIZE, DB_OFFSET_DEFAULT } = require('../../../helpers/constants');
const { Projects, QuotationsRequest } = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');
const { OkResponse } = require('../../../helpers/response.transforms');

const projectsListHandler = async (req, res) => {
  let response;
  try {
    const limit = req.query.size ? parseInt(req.query.size, 10) : DB_FETCH_SIZE;
    const offset = req.query.size ? parseInt(req.query.offset, 10) : DB_OFFSET_DEFAULT;
    const projects = await Projects.findAndCountAll({
      attributes: ['name', 'id', 'costCenter', 'startDate', 'status', 'additionalData',
        [Sequelize.fn('COUNT', Sequelize.col('quotation_requests.id')), 'quotationsCount'],
      ],
      subQuery: false,
      where: { buyerId: req.user.buyerId, isDeleted: false },
      limit,
      offset,
      order: [['updated_at', 'DESC']],
      include: [
        {
          model: QuotationsRequest,
          attributes: [],
          where: { isDeleted: false },
        },
      ],
      group: ['projects.id'],
    });
    projects.limit = limit;
    projects.offset = offset;
    projects.count = projects.count.length;
    response = OkResponse(projects, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while fetching projects', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  projectsListHandler,
};
