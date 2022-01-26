const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const moment = require('moment');
const logger = require('../../../helpers/logger');
const { Users } = require('../../../helpers/db.models');
const {
  OkResponse,
  UnauthorizedResponse,
} = require('../../../helpers/response.transforms');
const { INVALID_USER_ACCOUNT, ACCOUNT_LICENSE_EXPIRED } = require('../../../helpers/constants');
const { parseError } = require('../../../helpers/error.parser');

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
      if (moment().diff(user.buyer.licensedUntil) > 0) {
        throw new Error(ACCOUNT_LICENSE_EXPIRED);
      }
      const token = jwt.sign(
        {
          emailId: user.emailId,
          userId: user.id,
          domain: user.buyer.subDomainName,
          buyerId: user.buyer.id,
        },
        process.env.JWT_SECRET_KEY,
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
    response = parseError(error, req.traceId);
    logger.error('Error while login user', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  userLoginHandler,
};
