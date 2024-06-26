const { Roles } = require('./roles.model');
const { Countries, Regions, Comunas } = require('./countries.model');
const { Suppliers } = require('./suppliers.model');
const { SuppliersV2 } = require('./suppliers.v2.model');

const { Addresses } = require('./addresses.model');
const { SupplierCategoryMappings } = require('./supplier.category.mappings.model');
const { Categories } = require('./categories');
const { Buyers } = require('./buyers.model');
const { Users } = require('./users.model');
const { UsersRolesMappings } = require('./user.roles.mapping');
const { Projects } = require('./projects');
const { Files } = require('./files.model');
const { QuotationsRequest } = require('./quotations.request.model');
const { QuotationsResponse } = require('./quotations.response.model');
const { QuotationToSupplierMappings } = require('./quotation.supplier.mappings.model');
const { Activities } = require('./activities.model');

Regions.hasMany(Comunas, { foreignKey: 'region_id', targetKey: 'id' });
Regions.belongsTo(Countries);

Countries.hasMany(Regions, { foreignKey: 'country_id', targetKey: 'id' });

Buyers.belongsTo(Addresses, {
  as: 'businessAddress',
  foreignKey: 'contact_info_id',
  targetKey: 'id',
});

Suppliers.belongsTo(Addresses, {
  as: 'businessAddress',
  foreignKey: 'business_address_id',
  targetKey: 'id',
});

Suppliers.belongsTo(Addresses, {
  as: 'contactInfo',
  foreignKey: 'in_charge_address_id',
  targetKey: 'id',
});

Suppliers.belongsTo(Addresses, {
  as: 'billingAddress',
  foreignKey: 'billing_address_id',
  targetKey: 'id',
});

Suppliers.hasMany(SupplierCategoryMappings, {
  as: 'categories',
  foreignKey: 'supplier_id',
  targetKey: 'id',
});

SuppliersV2.belongsTo(Addresses, {
  as: 'businessAddress',
  foreignKey: 'business_address_id',
  targetKey: 'id',
});

SuppliersV2.belongsTo(Addresses, {
  as: 'contactInfo',
  foreignKey: 'in_charge_address_id',
  targetKey: 'id',
});

SuppliersV2.belongsTo(Addresses, {
  as: 'billingAddress',
  foreignKey: 'billing_address_id',
  targetKey: 'id',
});

SuppliersV2.hasMany(SupplierCategoryMappings, {
  as: 'categories',
  foreignKey: 'supplier_id',
  targetKey: 'id',
});

SupplierCategoryMappings.belongsTo(Suppliers, {
  as: 'suppliers',
  foreignKey: 'supplier_id',
  targetKey: 'id',
});

//  Suppliers.hasMany(Files, { as: 'logo', foreignKey: 'entity_id', targetKey: 'id' });
//  Projects.hasMany(Files, { as: 'files', foreignKey: 'entity_id', targetKey: 'id' });

Users.hasMany(UsersRolesMappings, { as: 'roleMap', foreignKey: 'user_id', targetKey: 'id' });
Users.belongsTo(Buyers, { as: 'buyer', foreignKey: 'buyer_id', targetKey: 'id' });
Buyers.hasMany(Users);
QuotationsRequest.belongsTo(Projects, { as: 'project', foreignKey: 'project_id', targetKey: 'id' });
Projects.hasMany(QuotationsRequest);

QuotationsResponse.belongsTo(QuotationsRequest, { as: 'quotation', foreignKey: 'quotation_request_id', targetKey: 'id' });
QuotationsRequest.hasMany(QuotationsResponse, {
  as: 'quotationResponse',
  foreignKey: 'quotation_request_id',
  targetKey: 'id',
});
QuotationsRequest.hasMany(QuotationToSupplierMappings, {
  as: 'suppliersMapping',
  foreignKey: 'quotation_request_id',
  targetKey: 'id',
});

QuotationsResponse.belongsTo(SuppliersV2, { as: 'supplierV2', foreignKey: 'supplier_id', targetKey: 'id' });
QuotationsResponse.belongsTo(Suppliers, { as: 'supplier', foreignKey: 'supplier_id', targetKey: 'id' });
QuotationsResponse.hasMany(QuotationToSupplierMappings, { as: 'quotation_mapping', foreignKey: 'quotation_request_id', targetKey: 'quotation_request_id' });
QuotationsResponse.hasMany(Files, { as: 'files', foreignKey: 'entityId', targetKey: 'id' });

QuotationToSupplierMappings.belongsTo(SuppliersV2, { as: 'supplierV2', foreignKey: 'supplier_id', targetKey: 'id' });
QuotationToSupplierMappings.belongsTo(Suppliers, { as: 'supplier', foreignKey: 'supplier_id', targetKey: 'id' });
QuotationToSupplierMappings.belongsTo(QuotationsResponse, { as: 'quotation', foreignKey: 'supplier_id', targetKey: 'supplier_id' });

Projects.belongsTo(Buyers, {
  as: 'buyer',
  foreignKey: 'buyerId',
  targetKey: 'id',
});

Categories.hasMany(SupplierCategoryMappings, { as: 'category_mappings', foreignKey: 'category_id', targetKey: 'id' });
SupplierCategoryMappings.belongsTo(Categories, { as: 'category', foreignKey: 'category_id', targetKey: 'id' });
Addresses.belongsTo(Regions, { as: 'region', foreignKey: 'region_id', targetKey: 'id' });
Addresses.belongsTo(Countries, { as: 'country', foreignKey: 'country_id', targetKey: 'id' });
Addresses.belongsTo(Comunas, { as: 'comuna', foreignKey: 'commune_id', targetKey: 'id' });

module.exports = {
  Roles,
  Countries,
  Regions,
  Suppliers,
  Addresses,
  SupplierCategoryMappings,
  Categories,
  Buyers,
  Users,
  Comunas,
  Projects,
  Files,
  QuotationsRequest,
  QuotationsResponse,
  UsersRolesMappings,
  Activities,
  SuppliersV2,
};
