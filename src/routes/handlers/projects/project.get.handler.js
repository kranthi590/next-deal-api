const { Sequelize } = require('sequelize');
const { INVALID_PROJECT_ID } = require('../../../helpers/constants');
const { Projects, QuotationsRequest } = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');
const { OkResponse } = require('../../../helpers/response.transforms');

const getProjectHandler = async (req, res) => {
  let response;
  try {
    const project = await Projects.findOne({
      where: { id: req.params.projectId },
      attributes: [
        ...Object.keys(Projects.rawAttributes),
        [Sequelize.fn('COUNT', Sequelize.col('quotation_requests.id')), 'quotationsCount'],
      ],
      include: [
        {
          model: QuotationsRequest,
          attributes: [],
        },
      ],
      group: ['projects.id'],
      subQuery: false,
    });
    if (!project) {
      throw new Error(INVALID_PROJECT_ID);
    }
    response = OkResponse(project.dataValues, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while fetching project', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  getProjectHandler,
};
