const { INVALID_PROJECT_ID } = require('../../../helpers/constants');
const { Projects } = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');
const { OkResponse } = require('../../../helpers/response.transforms');

const deleteProjectHandler = async (req, res) => {
  let response;
  try {
    const project = await Projects.findOne({
      where: {
        id: req.params.projectId,
        buyerId: req.user.buyerId,
        isDeleted: false,
      },
    });
    if (!project) {
      throw new Error(INVALID_PROJECT_ID);
    }
    await Projects.update(
      { isDeleted: true },
      {
        where: {
          id: req.params.projectId,
          buyerId: req.user.buyerId,
        },
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
