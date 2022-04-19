const { Sequelize } = require('sequelize');
const { INVALID_PROJECT_ID, FILE_TYPE } = require('../../../helpers/constants');
const { Projects, QuotationsRequest, Files } = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');
const { generateFileURL } = require('../../../helpers/generate.file.url');
const logger = require('../../../helpers/logger');
const { OkResponse } = require('../../../helpers/response.transforms');

const getProjectHandler = async (req, res) => {
  let response;
  try {
    const [project, filesMeta] = await Promise.all([
      Projects.findOne({
        where: { id: req.params.projectId, isDeleted: false },
        attributes: [
          ...Object.keys(Projects.rawAttributes),
          [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('quotation_requests.id'))), 'quotationsCount'],
        ],
        include: [
          {
            model: QuotationsRequest,
            attributes: [],
          },
        ],
      }),
      Files.findAll({
        where: {
          entityId: req.params.projectId,
          entityType: FILE_TYPE.PROJECT,
        },
      }),
    ]);
    if (!project) {
      throw new Error(INVALID_PROJECT_ID);
    }
    response = OkResponse({
      ...project.dataValues,
      files: generateFileURL(filesMeta),
    }, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while fetching project', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  getProjectHandler,
};
