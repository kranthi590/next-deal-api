const { BusinessAddress, User, UsersRolesMapping } = require('../../../helpers/db.models');

const logger = require('../../../helpers/logger');
const { getConnection } = require('../../../helpers/mysql');
const { parseError } = require('../../../helpers/error.parser');

const { ResourceCreatedResponse } = require('../../../helpers/response.transforms');

const saveUserWithMappings = async (body) => {
  const result = await getConnection().transaction(async (t) => {
    const businessAddress = await BusinessAddress.create(body.contactInfo, { transaction: t });
    const user = await User.create(
      {
        ...body,
        contactInfoId: businessAddress.dataValues.id,
        status: 1,
      },
      { transaction: t },
    );
    await UsersRolesMapping.create({
      userId: user.dataValues.id,
      roleId: 1, // For now every user has access to every route
    }, { transaction: t });
    return {
      ...user.dataValues,
      contactInfo: businessAddress.dataValues,
    };
  });
  return result;
};

const registerUserHandler = async (req, res) => {
  let response;
  try {
    const user = await saveUserWithMappings(req.body);
    response = ResourceCreatedResponse(user, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while registering user', error);
  }
  res.status(response.status).json(response);
};

module.exports = { registerUserHandler };
