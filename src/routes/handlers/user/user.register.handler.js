const bcrypt = require('bcrypt');

const { User } = require('../../../helpers/db.models/user.model');
const logger = require('../../../helpers/logger');
const { parseError } = require('../../../helpers/error.parser');
const { ResourceCreatedResponse } = require('../../../helpers/response.transforms');
const { Buyer } = require('../../../helpers/db.models');
const { getConnection } = require('../../../helpers/mysql');

const getBuyer = async (subDomain) => {
  const query = {
    where: {
      subDomainName: subDomain,
    },
  };
  return Buyer.findOne(query);
};

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
  return getConnection().transaction(async (t) => User.create(
    {
      businessAddress: { ...contactInfo },
      roleMap: [{ roleId: 1 }],
      firstName,
      lastName,
      emailId,
      additionalData,
      password: hash,
      type,
      buyerId: 1,
      status: 1,
    },
    { include: ['businessAddress', 'roleMap'], transaction: t },
  ));
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

module.exports = { registerUserHandler, getBuyerBySubDomain: getBuyer };
