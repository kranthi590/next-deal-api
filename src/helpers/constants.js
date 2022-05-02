module.exports = {
  INVALID_ACCOUNT_CREDENTIALS: 'INVALID_ACCOUNT_CREDENTIALS',
  ER_DUP_ENTRY: 'ER_DUP_ENTRY',
  ER_DUP_ENTRY_RUT: 'ER_DUP_ENTRY_RUT',
  ER_DUP_ENTRY_SUB_DOMAIN: 'ER_DUP_ENTRY_SUB_DOMAIN',
  ER_DUP_ENTRY_EMAIL_ID: 'ER_DUP_ENTRY_EMAIL_ID',
  INVALID_BUYER_ID: 'INVALID_BUYER_ID',
  INVALID_SUPPLIER_ID: 'INVALID_SUPPLIER_ID',
  INVALID_BUYER: 'INVALID_BUYER',
  CONFLICT: 'conflict',
  BUYER_DOMAIN_BUCKET_FORMAT: 'buyer-subdomain',
  SUPPLIER_BUCKET_FORMAT: 'supplier-bucket',
  INVALID_DOMAIN: 'INVALID_DOMAIN',
  INVALID_JWT_TOKEN: 'INVALID_JWT_TOKEN',
  BUYERS_USERS_LIMIT_EXCEEDED: 'BUYERS_USERS_LIMIT_EXCEEDED',
  ER_DUP_ENTRY_PROJECT_CODE: 'ER_DUP_ENTRY_PROJECT_CODE',
  ER_DUP_ENTRY_QUOTATION_CODE: 'ER_DUP_ENTRY_QUOTATION_CODE',
  BUYER_STATUS: {
    ACTIVE: 'active',
    IN_ACTIVE: 'inactive',
    SUSPENDED: 'suspended',
  },
  SUPPLIER_STATUS: {
    ACTIVE: 'active',
    IN_ACTIVE: 'inactive',
    SUSPENDED: 'suspended',
  },
  CURRENCY_TYPE: {
    CLP: 'clp',
    CL_UF: 'uf',
    USD: 'usd',
  },
  PROJECT_STATUS: {
    CREATED: 'created',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    ABORTED: 'aborted',
  },
  DB_FETCH_SIZE: 10,
  DB_OFFSET_DEFAULT: 0,
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  IMAGES_EXTENSIONS: ['image/png', 'image/jpg', 'image/jpeg'],
  INVALID_SUPPLIER_LOGO_FILE: 'INVALID_SUPPLIER_LOGO_FILE',
  FILE_TYPE: {
    PROJECT: 'project',
    QUOTATION_REQUEST: 'quotation_request',
    QUOTATION_RESPONSE: 'quotation_response',
    SUPPLIER_LOGO: 'supplier_logo',
  },
  QUOTATION_STATUS: {
    CREATED: 'created',
    IN_PROGRESS: 'in_progress',
    AWARDED: 'awarded',
    COMPLETED: 'completed',
    ABORTED: 'aborted',
  },
  ACTIVITIES_TYPES: {
    QUOTATION_CREATED: 'QUOTATION_CREATED',
    QUOTATION_RESPONSE_CREATED: 'QUOTATION_RESPONSE_CREATED',
    QUOTATION_AWARDED: 'QUOTATION_AWARDED',
    QUOTATION_RETAINED: 'QUOTATION_RETAINED',
    QUOTATION_COMPLETED: 'QUOTATION_COMPLETED',
    QUOTATION_ABORTED: 'QUOTATION_ABORTED',
    CUSTOM: 'CUSTOM',
  },
  INVALID_PROJECT_ID: 'INVALID_PROJECT_ID',
  INVALID_QUOTATION_STATUS: 'INVALID_QUOTATION_STATUS',
  INVALID_QUOTATION_ID: 'INVALID_QUOTATION_ID',
  INVALID_QUOTATION_RESPONSE_ID: 'INVALID_QUOTATION_RESPONSE_ID',
  QUOTATION_ALREADY_AWARDED: 'QUOTATION_ALREADY_AWARDED',
  ANOTHER_QUOTATION_ALREADY_AWARDED: 'ANOTHER_QUOTATION_ALREADY_AWARDED',
  QUOTATION_NOT_AWARDED: 'QUOTATION_NOT_AWARDED',
  QUOTATION_ALREADY_COMPLETED: 'QUOTATION_ALREADY_COMPLETED',
  QUOTATION_ALREADY_ABORTED: 'QUOTATION_ALREADY_ABORTED',
  INVALID_FILE: 'INVALID_FILE',
  INVALID_ASSET_RELATION: 'INVALID_ASSET_RELATION',
  INVALID_ASSET_RELATION_ID: 'INVALID_ASSET_RELATION_ID',
  ACCOUNT_LICENSE_EXPIRED: 'ACCOUNT_LICENSE_EXPIRED',
  PURCHASE_ORDER_NUMBER_NOT_FOUND: 'PURCHASE_ORDER_NUMBER_NOT_FOUND',
  QUOTATION_NOT_FOUND: 'QUOTATION_NOT_FOUND',
  INVALID_API_KEY: 'INVALID_API_KEY',
  INVALID_DATE: 'INVALID_DATE',
  QUOTATION_NOT_MAPPED_TO_THIS_BUYER: 'QUOTATION_NOT_MAPPED_TO_THIS_BUYER',
  QUOTATION_ALREADY_DELETED: 'QUOTATION_ALREADY_DELETED',
  PROJECT_ALREADY_DELETED: 'PROJECT_ALREADY_DELETED',
  INVALID_SHEET_NAME: 'INVALID_SHEET_NAME',
  SUPPLIERS_EXCEL_SHEET_NAME: 'Suppliers',
  SUPPLIER_ALREADY_ADDED_TO_QUOTATION: 'SUPPLIER_ALREADY_ADDED_TO_QUOTATION',
  QUOTATION_INVALID_UPDATE_REQUEST: 'QUOTATION_INVALID_UPDATE_REQUEST',
};
