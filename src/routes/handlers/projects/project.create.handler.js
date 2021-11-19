const { PROJECT_STATUS } = require('../../../helpers/constants');
const { Projects } = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');
const generateCode = require('../../../helpers/generate.code');
const logger = require('../../../helpers/logger');
const { OkResponse } = require('../../../helpers/response.transforms');

const projectCreationHandler = async (req, res) => {
  let response;
  try {
    const {
      name,
      startDate,
      expectedEndDate,
      costCenter,
      estimatedBudget,
      currency,
      description,
      managerName,
    } = req.body;
    const project = await Projects.create({
      name,
      managerName,
      code: generateCode(name),
      startDate,
      expectedEndDate,
      costCenter,
      estimatedBudget,
      currency,
      additionalData: description,
      buyerId: req.user.buyerId,
      createdBy: req.user.userId,
      status: PROJECT_STATUS.CREATED,
    });
    response = OkResponse(project, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while creating project:', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  projectCreationHandler,
};
