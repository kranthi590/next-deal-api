const logger = require('../../../helpers/logger');
const { Users } = require('../../../helpers/db.models');
const { InternalServerErrorResponse, OkResponse, UnauthorizedResponse } = require('../../../helpers/response.transforms');
const { INVALID_USER_ACCOUNT } = require('../../../helpers/constants');

const getUser = async (userId, buyerId) => {
  const query = {
    include: ['buyer'],
    where: {
      id: userId,
      buyerId,
    },
    attributes: {},
    nest: true,
  };
  return Users.findOne(query);
};

const getUserHandler = async (req, res) => {
  let response;
  try {
    if (req.user.userId.toString() !== req.params.userId) {
      response = UnauthorizedResponse(INVALID_USER_ACCOUNT, req.traceId);
    } else {
      const user = await getUser(req.user.userId, req.user.buyerId);
      response = OkResponse(user, req.traceId);
    }
  } catch (error) {
    response = InternalServerErrorResponse(error, req.traceId);
    logger.error('Error while fetching user', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  getUserHandler,
};
