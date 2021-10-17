const logger = require('../../../helpers/logger');

const { User } = require('../../../helpers/db.models/user.model');
const {
  InternalServerErrorResponse,
  OkResponse,
  NotFoundResponse,
} = require('../../../helpers/response.transforms');
const { Role } = require('../../../helpers/db.models');

const getUser = async (userId) => {
  const query = {
    include: ['businessAddress', Role],
    where: {
      id: userId,
    },
    attributes: {},
    nest: true,
  };
  return User.findOne(query);
};

const getUserHandler = async (req, res) => {
  let response;
  try {
    const user = await getUser(req.params.userId);
    if (user) {
      response = OkResponse(user, req.traceId);
    } else {
      response = NotFoundResponse({}, req.traceId);
    }
  } catch (error) {
    response = InternalServerErrorResponse('', req.traceId);
    logger.error(`Error while fetching user ${error}`);
  }
  res.status(response.status).json(response);
};

module.exports = {
  getUserHandler,
};
