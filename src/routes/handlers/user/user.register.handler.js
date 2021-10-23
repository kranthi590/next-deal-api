const bcrypt = require('bcrypt');

const { Users } = require('../../../helpers/db.models/user.model');
const logger = require('../../../helpers/logger');
const { parseError } = require('../../../helpers/error.parser');
const { ResourceCreatedResponse } = require('../../../helpers/response.transforms');
const { getConnection } = require('../../../helpers/mysql');

const buyerId = 14;

const saveUserWithMappings = async ({
  firstName,
  lastName,
  emailId,
  additionalData,
  password,
  type,
  contactInfo,
}) => {
  const hash = bcrypt.hashSync(password, 10);
  return getConnection().transaction(async (t) => Users.create(
    {
      address: { ...contactInfo },
      roleMap: [{ roleId: 1 }],
      firstName,
      lastName,
      emailId,
      additionalData,
      password: hash,
      type,
      buyerId,
      status: 1,
    },
    { include: ['address', 'roleMap'], transaction: t },
  ));
};

const registerUserHandler = async (req, res) => {
  let response;
  try {
    const user = await saveUserWithMappings(req.body);
    response = ResourceCreatedResponse(user, req.traceId);
  } catch (error) {
    console.log(`req.traceId: ${req.traceId}`);
    response = parseError(error, req.traceId);
    logger.error('Error while registering user', error);
  }
  res.status(response.status).json(response);
};

module.exports = { registerUserHandler };
