const { Countries, Regions, Comunas } = require('./country.model');

const { Roles } = require('./role.model');
const { Suppliers } = require('./supplier.model');
const { Addresses } = require('./address.model');
const { SupplierCategoryMappings } = require('./supplier.category.mapping.model');
const { SupplierServiceLocationsMappings } = require('./supplier.service.locations.mappings.model');
const { Categories } = require('./categories');
const { Buyers } = require('./buyer.model');
const { Users } = require('./user.model');
const { UsersRolesMappings } = require('./user.roles.mapping');

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

Users.belongsTo(Addresses, {
  as: 'address',
  foreignKey: 'contact_info_id',
  targetKey: 'id',
});

Users.hasMany(UsersRolesMappings, { as: 'roleMap', foreignKey: 'user_id', targetKey: 'id' });
Users.belongsTo(Buyers, { as: 'buyer', foreignKey: 'buyer_id', targetKey: 'id' });

module.exports = {
  Countries,
  Regions,
  Roles,
  Suppliers,
  Addresses,
  SupplierCategoryMappings,
  SupplierServiceLocationsMappings,
  Categories,
  Buyers,
  Users,
  UsersRolesMappings,
  Comunas,
};
