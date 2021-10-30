const { INVALID_BUYER_ID } = require('../../../helpers/constants');
const { Projects } = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');
const { OkResponse, NotFoundResponse } = require('../../../helpers/response.transforms');

const projectsListHandler = async (req, res) => {
  let response;
  try {
    if (req.user.buyerId.toString() !== req.params.buyerId) {
      response = NotFoundResponse(INVALID_BUYER_ID, req.traceId);
    } else {
      const limit = req.query.size ? parseInt(req.query.size, 10) : 6;
      const offset = req.query.size ? parseInt(req.query.offset, 10) : 0;
      const projects = await Projects.findAndCountAll({
        where: { buyerId: req.user.buyerId },
        limit,
        offset,
      });
      projects.limit = limit;
      projects.offset = offset;
      response = OkResponse(projects, req.traceId);
    }
  } catch (error) {
    console.error(error);
    response = parseError(error, req.traceId);
    logger.error(`Error while fetching projects: ${error}`);
  }
  res.status(response.status).json(response);
};

module.exports = {
  projectsListHandler,
};
