const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const moment = require('moment');
const logger = require('../../../helpers/logger');
const { Users } = require('../../../helpers/db.models');
const {
  InternalServerErrorResponse,
  OkResponse,
  UnauthorizedResponse,
} = require('../../../helpers/response.transforms');
const { INVALID_USER_ACCOUNT } = require('../../../helpers/constants');

const getUser = async (emailId) => {
  const query = {
    where: {
      emailId,
    },
    include: ['buyer', 'address'],
  };
  return Users.findOne(query);
};

const userLoginHandler = async (req, res) => {
  let response;
  try {
    const { emailId, password } = req.body;
    const user = await getUser(emailId);
    if (user && user.status && bcrypt.compareSync(password, user.password)) {
      const date = moment(user.buyer.licensedUntil);
      const { JWT_SECRET_KEY } = process.env;
      const token = jwt.sign(
        {
          emailId: user.emailId,
          userId: user.id,
          domain: user.buyer.subDomainName,
          buyerId: user.buyer.id,
        },
        JWT_SECRET_KEY,
        {
          expiresIn: `${date.diff(moment.utc(), 'days')}d`,
        },
      );
      delete user.password;
      response = OkResponse({ user, token }, req.traceId);
    } else {
      response = UnauthorizedResponse(INVALID_USER_ACCOUNT, req.traceId);
    }
  } catch (error) {
    response = InternalServerErrorResponse('', req.traceId);
    logger.error('Error while fetching user ', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  userLoginHandler,
};