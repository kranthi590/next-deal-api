const { Roles } = require('./roles.model');
const { Countries, Regions, Comunas } = require('./countries.model');
const { Suppliers } = require('./suppliers.model');
const { Addresses } = require('./addresses.model');
const { SupplierCategoryMappings } = require('./supplier.category.mappings.model');
const { SupplierServiceLocationsMappings } = require('./supplier.service.locations.mappings.model');
const { Categories } = require('./categories');
const { Buyers } = require('./buyers.model');
const { Users } = require('./users.model');
const { UsersRolesMappings } = require('./user.roles.mapping');
const { Projects } = require('./projects');
const { Files } = require('./files.model');
const { QuotationsRequest } = require('./quotations.request.model');
const { QuotationsResponse } = require('./quotations.response.model');
const { QuotationToSupplierMappings } = require('./quotation.supplier.mappings.model');

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

Suppliers.hasMany(SupplierServiceLocationsMappings, {
  as: 'serviceLocations',
  foreignKey: 'supplier_id',
  targetKey: 'id',
});

Suppliers.hasMany(Files, { as: 'logo', foreignKey: 'entity_id', targetKey: 'id' });

Users.belongsTo(Addresses, {
  as: 'address',
  foreignKey: 'contact_info_id',
  targetKey: 'id',
});

Users.hasMany(UsersRolesMappings, { as: 'roleMap', foreignKey: 'user_id', targetKey: 'id' });
Users.belongsTo(Buyers, { as: 'buyer', foreignKey: 'buyer_id', targetKey: 'id' });
Buyers.hasMany(Users);
QuotationsRequest.belongsTo(Projects, { as: 'project', foreignKey: 'project_id', targetKey: 'id' });
Projects.hasMany(QuotationsRequest);

QuotationsResponse.belongsTo(QuotationsRequest, { as: 'quotation', foreignKey: 'quotation_request_id', targetKey: 'id' });
QuotationsRequest.hasMany(QuotationsResponse);
QuotationsRequest.hasMany(QuotationToSupplierMappings, {
  as: 'suppliers',
  foreignKey: 'quotation_request_id',
  targetKey: 'id',
});

module.exports = {
  Roles,
  Countries,
  Regions,
  Suppliers,
  Addresses,
  SupplierCategoryMappings,
  SupplierServiceLocationsMappings,
  Categories,
  Buyers,
  Users,
  Comunas,
  Projects,
  Files,
  QuotationsRequest,
  QuotationsResponse,
  UsersRolesMappings,
};
