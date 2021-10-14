const logger = require('../../../helpers/logger');

const { User } = require('../../../helpers/db.models');
const { InternalServerErrorResponse, OkResponse } = require('../../../helpers/response.transforms');

const getUser = async (userId) => {
  const query = {
    include: ['businessAddress'],
    where: {
      id: userId,
    },
    attributes: {},
    raw: true,
    nest: true,
  };
  return User.findOne(query);
};

const getUserHandler = async (req, res) => {
  let response;
  try {
    const user = await getUser(req.params.userId);
    response = OkResponse(user, req.traceId);
  } catch (error) {
    response = InternalServerErrorResponse('', req.traceId);
    logger.error(`Error while fetching user ${error}`);
  }
  res.status(response.status).json(response);
};

module.exports = {
  getUserHandler,
};
