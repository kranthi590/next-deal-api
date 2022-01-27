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
  INVALID_QUOTATION_ID,
  INVALID_QUOTATION_RESPONSE_ID,
  QUOTATION_ALREADY_AWARDED,
  QUOTATION_ALREADY_COMPLETED,
  QUOTATION_NOT_AWARDED,
  INVALID_FILE_TYPE,
  ANOTHER_QUOTATION_ALREADY_AWARDED,
  INVALID_FILE,
  INVALID_ASSET_RELATION_ID,
  INVALID_ASSET_RELATION,
  ACCOUNT_LICENSE_EXPIRED,
  PURCHASE_ORDER_NUMBER_NOT_FOUND,
  INVALID_USER_ACCOUNT,
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
  if (
    _.get(error, 'original.errno', null) === 1452
    && _.get(error, 'fields[0]', null) === 'quotation_request_id'
  ) {
    return ForbiddenResponse(INVALID_QUOTATION_ID, traceId);
  }
  if (
    _.get(error, 'original.errno', null) === 1452
    && _.get(error, 'fields[0]', null) === 'supplier_id'
  ) {
    return ForbiddenResponse(INVALID_SUPPLIER_ID, traceId);
  }
  if (_.get(error, 'message', null) === INVALID_PROJECT_ID) {
    return ForbiddenResponse(INVALID_PROJECT_ID, traceId);
  }
  if (_.get(error, 'message', null) === INVALID_QUOTATION_ID) {
    return ForbiddenResponse(INVALID_QUOTATION_ID, traceId);
  }
  if (_.get(error, 'message', null) === INVALID_QUOTATION_RESPONSE_ID) {
    return ForbiddenResponse(INVALID_QUOTATION_RESPONSE_ID, traceId);
  }
  if (_.get(error, 'message', null) === INVALID_BUYER_ID) {
    return ForbiddenResponse(INVALID_BUYER_ID, traceId);
  }
  if (_.get(error, 'message', null) === QUOTATION_ALREADY_AWARDED) {
    return ForbiddenResponse(QUOTATION_ALREADY_AWARDED, traceId);
  }
  if (_.get(error, 'message', null) === QUOTATION_ALREADY_COMPLETED) {
    return ForbiddenResponse(QUOTATION_ALREADY_COMPLETED, traceId);
  }
  if (_.get(error, 'message', null) === QUOTATION_NOT_AWARDED) {
    return ForbiddenResponse(QUOTATION_NOT_AWARDED, traceId);
  }
  if (_.get(error, 'message', null) === ANOTHER_QUOTATION_ALREADY_AWARDED) {
    return ForbiddenResponse(ANOTHER_QUOTATION_ALREADY_AWARDED, traceId);
  }
  if (_.get(error, 'message', null) === INVALID_FILE_TYPE) {
    return ForbiddenResponse(INVALID_FILE_TYPE, traceId);
  }
  if (_.get(error, 'message', null) === INVALID_SUPPLIER_ID) {
    return ForbiddenResponse(INVALID_SUPPLIER_ID, traceId);
  }
  if (_.get(error, 'message', null) === INVALID_FILE) {
    return ForbiddenResponse(INVALID_FILE, traceId);
  }
  if (_.get(error, 'message', null) === INVALID_ASSET_RELATION_ID) {
    return ForbiddenResponse(INVALID_ASSET_RELATION_ID, traceId);
  }
  if (_.get(error, 'message', null) === INVALID_ASSET_RELATION) {
    return ForbiddenResponse(INVALID_ASSET_RELATION, traceId);
  }
  if (_.get(error, 'message', null) === ACCOUNT_LICENSE_EXPIRED) {
    return ForbiddenResponse(ACCOUNT_LICENSE_EXPIRED, traceId);
  }
  if (_.get(error, 'message', null) === INVALID_USER_ACCOUNT) {
    return ForbiddenResponse(INVALID_USER_ACCOUNT, traceId);
  }
  if (_.get(error, 'original.code', null) === ER_DUP_ENTRY && _.get(error, 'fields.projects_buyer_id_code', false)) {
    return ConflictResponse(ER_DUP_ENTRY_PROJECT_CODE, traceId);
  }
  if (_.get(error, 'message', null) === PURCHASE_ORDER_NUMBER_NOT_FOUND) {
    return ForbiddenResponse(PURCHASE_ORDER_NUMBER_NOT_FOUND, traceId);
  }
  return InternalServerErrorResponse(error, traceId);
};

module.exports = {
  parseError,
};
