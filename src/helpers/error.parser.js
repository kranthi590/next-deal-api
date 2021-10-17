const _ = require('lodash');
const { ConflictResponse, InternalServerErrorResponse } = require('./response.transforms');

const parseError = (error, traceId) => {
  if (_.get(error, 'original.code', null) === 'ER_DUP_ENTRY' && _.get(error, 'fields.rut', false)) {
    return ConflictResponse('ER_DUP_ENTRY_RUT', traceId);
  }
  if (
    _.get(error, 'original.code', null) === 'ER_DUP_ENTRY'
    && _.get(error, 'fields.subdomain_name', false)
  ) {
    return ConflictResponse('ER_DUP_ENTRY_SUB_DOMAIN', traceId);
  }
  if (
    _.get(error, 'original.code', null) === 'ER_DUP_ENTRY'
    && _.get(error, 'fields.email_id', false)
  ) {
    return ConflictResponse('ER_DUP_ENTRY_EMAIL_ID', traceId);
  }
  if (_.get(error, 'errors[0].message', null) === 'INVALID_BUYER_ID') {
    return ConflictResponse('INVALID_BUYER_ID', traceId);
  }
  if (_.get(error, 'errors[0].message', null) === 'INVALID_SUPPLIER_ID') {
    return ConflictResponse('INVALID_SUPPLIER_ID', traceId);
  }
  return InternalServerErrorResponse('', traceId);
};

module.exports = {
  parseError,
};
