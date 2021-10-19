const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const moment = require('moment');
const logger = require('../../../helpers/logger');
const { User } = require('../../../helpers/db.models/user.model');
const {
  InternalServerErrorResponse,
  OkResponse,
  UnauthorizedResponse,
} = require('../../../helpers/response.transforms');

const getUser = async (emailId) => {
  const query = {
    where: {
      emailId,
    },
    attributes: {},
    include: ['buyer'],
  };
  return User.findOne(query);
};

const userLoginHandler = async (req, res) => {
  let response;
  try {
    const { emailId, password } = req.body;
    const user = await getUser(emailId);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      response = UnauthorizedResponse('INVALID_ACCOUNT', req.traceId);
    } if (!user.status) {
      response = UnauthorizedResponse('USER_ACCOUNT_SUSPENDED', req.traceId);
    } else if (user.buyer.subDomainName !== req.buyer.subDomainName) {
      response = UnauthorizedResponse('INVALID_ACCOUNT_DOMAIN', req.traceId);
    } else {
      const date = moment(user.buyer.licensedUntil);
      const token = jwt.sign(
        {
          emailId: user.emailId,
          domain: user.buyer.subDomainName,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: `${date.diff(moment.utc(), 'days')}d`,
        },
      );
      response = OkResponse({ user, token }, req.traceId);
    }
  } catch (error) {
    response = InternalServerErrorResponse('', req.traceId);
    logger.error(`Error while fetching user ${error}`);
  }
  res.status(response.status).json(response);
};

module.exports = {
  userLoginHandler,
};
