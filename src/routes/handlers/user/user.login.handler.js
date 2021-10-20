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
const { getSubDomainFromRequest } = require('../../../helpers/get.subdomain');

const getUser = async (emailId) => {
  const query = {
    where: {
      emailId,
    },
    include: ['buyer', 'businessAddress'],
  };
  return User.findOne(query);
};

const userLoginHandler = async (req, res) => {
  let response;
  try {
    const { emailId, password } = req.body;
    const user = await getUser(emailId);
    if (
      user
      && bcrypt.compareSync(password, user.password)
      && user.buyer.subDomainName === getSubDomainFromRequest(req.get('host'))
    ) {
      const date = moment(user.buyer.licensedUntil);
      const { JWT_SECRET_KEY } = process.env;
      const token = jwt.sign(
        {
          emailId: user.emailId,
          userId: user.id,
          domain: user.buyer.subDomainName,
        },
        JWT_SECRET_KEY,
        {
          expiresIn: `${date.diff(moment.utc(), 'days')}d`,
        },
      );
      response = OkResponse({ user, token }, req.traceId);
    } else {
      response = UnauthorizedResponse('INVALID_USER_ACCOUNT', req.traceId);
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
