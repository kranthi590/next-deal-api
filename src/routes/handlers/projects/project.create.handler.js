const { PROJECT_STATUS } = require('../../../helpers/constants');
const { Projects } = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');
const { OkResponse } = require('../../../helpers/response.transforms');

const generateProjectCode = (projectName) => projectName
  .toString()
  .toLowerCase()
  .replace(/'/g, "'")
  .replace(/\s+/g, '-') // Replace spaces with -
  .replace(/[^\u0100-\uFFFF\w\\-]/g, '-') // Remove all non-word chars ( fix for UTF-8 chars )
  .replace(/\\-\\-+/g, '-') // Replace multiple - with single -
  .replace(/^-+/, '') // Trim - from start of text
  .replace(/-+$/, ''); // Trim - from end of text

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
      code: generateProjectCode(name),
      startDate,
      expectedEndDate,
      costCenter,
      estimatedBudget,
      currency,
      description,
      buyerId: req.user.buyerId,
      createdBy: req.user.userId,
      status: PROJECT_STATUS.CREATED,
    });
    response = OkResponse(project, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error(`Error while creating project: ${error}`);
  }
  res.status(response.status).json(response);
};

module.exports = {
  projectCreationHandler,
};
