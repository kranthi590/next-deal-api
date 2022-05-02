const _ = require('lodash');
const {
  ConflictResponse,
  InternalServerErrorResponse,
  ForbiddenResponse,
  BadRequestResponse,
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
  INVALID_ACCOUNT_CREDENTIALS,
  QUOTATION_NOT_FOUND,
  INVALID_DATE,
  QUOTATION_NOT_MAPPED_TO_THIS_BUYER,
  QUOTATION_ALREADY_DELETED,
  PROJECT_ALREADY_DELETED,
  INVALID_SHEET_NAME,
  SUPPLIERS_EXCEL_SHEET_NAME,
  SUPPLIER_ALREADY_ADDED_TO_QUOTATION,
  QUOTATION_ALREADY_ABORTED,
} = require('./constants');

const parseError = (error, traceId, context) => {
  if (_.get(error, 'original.code', null) === ER_DUP_ENTRY && _.get(error, 'fields.code', false)) {
    return ConflictResponse(context === 'quotation_create'
      ? ER_DUP_ENTRY_QUOTATION_CODE : ER_DUP_ENTRY_PROJECT_CODE, traceId);
  }
  if (
    _.get(error, 'original.code', null) === ER_DUP_ENTRY
    && _.get(error, 'fields.unique_index', false)
    && context === 'quotation_supplier_add'
  ) {
    return ConflictResponse(SUPPLIER_ALREADY_ADDED_TO_QUOTATION, traceId);
  }
  if (
    _.get(error, 'original.code', null) === ER_DUP_ENTRY
    && _.get(error, 'fields.unique_index', false)
    && context === 'supplier'
  ) {
    return ConflictResponse(ER_DUP_ENTRY_RUT, traceId);
  }
  if (_.get(error, 'original.code', null) === ER_DUP_ENTRY && _.get(error, 'fields.quotation_requests_project_id_code', false)) {
    return ConflictResponse(ER_DUP_ENTRY_QUOTATION_CODE, traceId);
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
  if (_.get(error, 'message', null) === QUOTATION_ALREADY_ABORTED) {
    return ForbiddenResponse(QUOTATION_ALREADY_ABORTED, traceId);
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
  if (_.get(error, 'message', null) === INVALID_ACCOUNT_CREDENTIALS) {
    return ForbiddenResponse(INVALID_ACCOUNT_CREDENTIALS, traceId);
  }
  if (_.get(error, 'original.code', null) === ER_DUP_ENTRY && _.get(error, 'fields.projects_buyer_id_code', false)) {
    return ConflictResponse(ER_DUP_ENTRY_PROJECT_CODE, traceId);
  }
  if (_.get(error, 'message', null) === PURCHASE_ORDER_NUMBER_NOT_FOUND) {
    return ForbiddenResponse(PURCHASE_ORDER_NUMBER_NOT_FOUND, traceId);
  }
  if (_.get(error, 'message', null) === QUOTATION_NOT_FOUND) {
    return ForbiddenResponse(QUOTATION_NOT_FOUND, traceId);
  }
  if (_.get(error, 'message', null) === INVALID_DATE) {
    return ForbiddenResponse(INVALID_DATE, traceId);
  }
  if (_.get(error, 'message', null) === QUOTATION_NOT_MAPPED_TO_THIS_BUYER) {
    return ForbiddenResponse(QUOTATION_NOT_MAPPED_TO_THIS_BUYER, traceId);
  }
  if (_.get(error, 'message', null) === QUOTATION_ALREADY_DELETED) {
    return ForbiddenResponse(QUOTATION_ALREADY_DELETED, traceId);
  }
  if (_.get(error, 'message', null) === PROJECT_ALREADY_DELETED) {
    return ForbiddenResponse(PROJECT_ALREADY_DELETED, traceId);
  }
  if (_.get(error, 'message', null) === INVALID_SHEET_NAME) {
    return ForbiddenResponse(INVALID_SHEET_NAME, traceId, `Sheet '${SUPPLIERS_EXCEL_SHEET_NAME}' does not exists`);
  }
  if (_.get(error, 'message', null) === ER_DUP_ENTRY_RUT) {
    return ForbiddenResponse(ER_DUP_ENTRY_RUT, traceId);
  }
  if (error.details) {
    return BadRequestResponse(
      error.message === 'NO_SCHEMA' ? 'NO_VALIDATION_SCHEMA_DEFINED' : error.details,
      traceId, 'Validation errors',
    );
  }
  return InternalServerErrorResponse(error, traceId);
};

module.exports = {
  parseError,
};
