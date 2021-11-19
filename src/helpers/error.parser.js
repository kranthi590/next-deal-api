const _ = require('lodash');
const {
  ConflictResponse,
  InternalServerErrorResponse,
  ForbiddenResponse,
} = require('./response.transforms');
const {
  ER_DUP_ENTRY,
  ER_DUP_ENTRY_RUT,
  ER_DUP_ENTRY_SUB_DOMAIN,
  ER_DUP_ENTRY_EMAIL_ID,
  INVALID_BUYER_ID,
  INVALID_SUPPLIER_ID,
  INVALID_BUYER,
  ER_DUP_ENTRY_PROJECT_CODE,
  INVALID_PROJECT_ID,
  ER_DUP_ENTRY_QUOTATION_CODE,
} = require('./constants');

const parseError = (error, traceId, context) => {
  if (_.get(error, 'original.code', null) === ER_DUP_ENTRY && _.get(error, 'fields.code', false)) {
    return ConflictResponse(context === 'quotation_create'
      ? ER_DUP_ENTRY_QUOTATION_CODE : ER_DUP_ENTRY_PROJECT_CODE, traceId);
  }
  if (_.get(error, 'original.code', null) === ER_DUP_ENTRY && _.get(error, 'fields.rut', false)) {
    return ConflictResponse(ER_DUP_ENTRY_RUT, traceId);
  }
  if (
    _.get(error, 'original.code', null) === ER_DUP_ENTRY
    && _.get(error, 'fields.subdomain_name', false)
  ) {
    return ConflictResponse(ER_DUP_ENTRY_SUB_DOMAIN, traceId);
  }
  if (
    _.get(error, 'original.code', null) === ER_DUP_ENTRY
    && _.get(error, 'fields.email_id', false)
  ) {
    return ConflictResponse(ER_DUP_ENTRY_EMAIL_ID, traceId);
  }
  if (_.get(error, 'errors[0].message', null) === INVALID_BUYER_ID) {
    return ConflictResponse(INVALID_BUYER_ID, traceId);
  }
  if (_.get(error, 'errors[0].message', null) === INVALID_SUPPLIER_ID) {
    return ConflictResponse(INVALID_SUPPLIER_ID, traceId);
  }
  if (
    _.get(error, 'original.errno', null) === 1452
    && _.get(error, 'fields[0]', null) === 'buyer_id'
  ) {
    return ForbiddenResponse(INVALID_BUYER, traceId);
  }
  if (
    _.get(error, 'original.errno', null) === 1452
    && _.get(error, 'fields[0]', null) === 'project_id'
  ) {
    return ForbiddenResponse(INVALID_PROJECT_ID, traceId);
  }
  if (_.get(error, 'message', null) === INVALID_PROJECT_ID) {
    return ForbiddenResponse(INVALID_PROJECT_ID, traceId);
  }
  return InternalServerErrorResponse(error, traceId);
};

module.exports = {
  parseError,
};
