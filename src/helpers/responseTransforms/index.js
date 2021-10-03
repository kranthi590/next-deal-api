const OkResponse = require('./200.response');
const NotModifiedResponse = require('./304.response');
const UnprocessableEntityResponse = require('./422.response');
const InternalErrorResponse = require('./500.response');
const NotFoundResponse = require('./404.response');
const InternalServerErrorResponse = require('./500.response');
const BadRequestResponse = require('./400.response');
const UnauthorizedResponse = require('./401.response');
const ForbiddenResponse = require('./403.response');

module.exports = {
  OkResponse,
  NotModifiedResponse,
  NotFoundResponse,
  InternalServerErrorResponse,
  UnprocessableEntityResponse,
  InternalErrorResponse,
  BadRequestResponse,
  UnauthorizedResponse,
  ForbiddenResponse,
};
