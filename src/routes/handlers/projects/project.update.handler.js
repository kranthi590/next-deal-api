const cleanObject = require('../../../helpers/clean.object');
const { INVALID_PROJECT_ID } = require('../../../helpers/constants');
const { Projects } = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');
const { OkResponse } = require('../../../helpers/response.transforms');

const projectUpdateHandler = async (req, res) => {
  let response;
  try {
    const {
      id,
      managerName,
      name,
      expectedEndDate,
      costCenter,
      description,
    } = req.body;
    const updateProjectObject = {
      managerName,
      name,
      expectedEndDate,
      costCenter,
      description,
    };
    const project = await Projects.findOne({
      where: { id, buyerId: req.user.buyerId, isDeleted: false },
    });
    if (!project) {
      throw new Error(INVALID_PROJECT_ID);
    }
    const updatedProject = await Projects.update(
      cleanObject(updateProjectObject),
      { where: { id: project.id } },
    );
    response = OkResponse(updatedProject, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while updating project:', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  projectUpdateHandler,
};
