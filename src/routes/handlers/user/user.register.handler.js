const { User } = require('../../../helpers/db.models/user.model');

const logger = require('../../../helpers/logger');
const { parseError } = require('../../../helpers/error.parser');

const { ResourceCreatedResponse } = require('../../../helpers/response.transforms');

const saveUserWithMappings = async (body) => User.create(
  {
    businessAddress: { ...body.contactInfo },
    roleMap: { roleId: 1 },
    ...body,
    status: 1,
  },
  { include: ['businessAddress', 'roleMap'] },
);

const registerUserHandler = async (req, res) => {
  let response;
  try {
    const user = await saveUserWithMappings(req.body);
    response = ResourceCreatedResponse(user, req.traceId);
  } catch (error) {
    console.error(error);
    response = parseError(error, req.traceId);
    logger.error('Error while registering user', error);
  }
  res.status(response.status).json(response);
};

module.exports = { registerUserHandler };
