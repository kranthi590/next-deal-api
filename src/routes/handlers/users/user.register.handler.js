const bcrypt = require('bcrypt');

const { Sequelize } = require('sequelize');
const { Users } = require('../../../helpers/db.models');
const logger = require('../../../helpers/logger');
const { parseError } = require('../../../helpers/error.parser');
const {
  ResourceCreatedResponse,
  ForbiddenResponse,
} = require('../../../helpers/response.transforms');
const { getConnection } = require('../../../helpers/mysql');
const { getSubDomainFromRequest } = require('../../../helpers/get.subdomain');
const { Buyers } = require('../../../helpers/db.models');
const { INVALID_DOMAIN, BUYERS_USERS_LIMIT_EXCEEDED } = require('../../../helpers/constants');

const getBuyer = async (subDomainName) => {
  const query = {
    where: {
      subDomainName,
    },
    attributes: {
      include: [[Sequelize.fn('COUNT', Sequelize.col('users.id')), 'usersCount']],
    },
    include: [
      {
        model: Users,
        attributes: [],
      },
    ],
  };
  return Buyers.findOne(query);
};

const saveUserWithMappings = async (
  {
    firstName, lastName, emailId, additionalData, password, type,
  },
  buyer,
) => {
  const hash = bcrypt.hashSync(password, 10);
  return getConnection().transaction(async (t) => Users.create(
    {
      roleMap: [{ roleId: 1 }],
      firstName,
      lastName,
      emailId,
      additionalData,
      password: hash,
      type,
      buyerId: buyer.id,
      status: 1,
    },
    { include: ['roleMap'], transaction: t },
  ));
};

const registerUserHandler = async (req, res) => {
  let response;
  try {
    const subDomain = getSubDomainFromRequest(req);
    if (!subDomain) {
      response = ForbiddenResponse(INVALID_DOMAIN, req.traceId);
    } else {
      const buyer = await getBuyer(subDomain);
      if (!buyer || buyer.dataValues.usersCount > 0) {
        response = ForbiddenResponse(
          buyer && buyer.dataValues.usersCount > 0 ? BUYERS_USERS_LIMIT_EXCEEDED : INVALID_DOMAIN,
          req.traceId,
        );
      } else {
        const user = await saveUserWithMappings(req.body, buyer);
        response = ResourceCreatedResponse(user, req.traceId);
      }
    }
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while registering user', error);
  }
  res.status(response.status).json(response);
};

module.exports = { registerUserHandler };
