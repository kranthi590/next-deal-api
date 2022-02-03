const { INVALID_PROJECT_ID, PROJECT_ALREADY_DELETED } = require('../../../helpers/constants');
const { Projects } = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');
const { OkResponse } = require('../../../helpers/response.transforms');

const deleteProjectHandler = async (req, res) => {
  let response;
  try {
    const project = await Projects.findOne({
      id: req.params.projectId,
      buyerId: req.user.buyerId,
    });
    if (!project) {
      throw new Error(INVALID_PROJECT_ID);
    }
    const {
      id,
      buyerId,
      isDeleted,
    } = project.toJSON();
    if (isDeleted) {
      throw new Error(PROJECT_ALREADY_DELETED);
    }
    await Projects.update(
      { isDeleted: true },
      {
        where: {
          id,
          buyerId,
        },
        returning: true,
      },
    );
    response = OkResponse({}, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while deleting project', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  deleteProjectHandler,
};
