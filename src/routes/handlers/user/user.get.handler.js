const logger = require('../../../helpers/logger');
const { Users } = require('../../../helpers/db.models/user.model');
const { InternalServerErrorResponse, OkResponse } = require('../../../helpers/response.transforms');

const getUser = async (userId) => {
  const query = {
    include: ['address', 'buyer'],
    where: {
      id: userId,
    },
    attributes: {},
    nest: true,
  };
  return Users.findOne(query);
};

const getUserHandler = async (req, res) => {
  let response;
  try {
    const user = await getUser(req.user.userId);
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
