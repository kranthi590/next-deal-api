const {
  Countries, Regions, Provincias, Comunas,
} = require('./country.model');

const { Role } = require('./role.model');
const { Supplier } = require('./supplier.model');
const { Address, BusinessAddress } = require('./address.model');
const { SupplierCategoryMapping } = require('./supplier.category.mapping.model');
const { SupplierServiceLocationsMappings } = require('./supplier.service.locations.mappings.model');
const { Categories } = require('./categories');

Countries.hasMany(Regions, { as: 'region', foreignKey: 'country_id' });
Provincias.hasMany(Comunas, { as: 'comuna', foreignKey: 'provincia_id' });

Supplier.belongsTo(BusinessAddress, { as: 'businessAddress', foreignKey: 'business_address_id' });
Supplier.belongsTo(Address, { as: 'inchargeAddress', foreignKey: 'in_charge_address_id' });
Supplier.belongsTo(Address, { as: 'billingAddress', foreignKey: 'billing_address_id' });

SupplierCategoryMapping.belongsTo(Categories, { as: 'category', foreignKey: 'category_id' });
SupplierServiceLocationsMappings.belongsTo(Regions, { as: 'region', foreignKey: 'region_id' });

/*
Supplier.belongsToMany(Categories, { through: SupplierCategoryMapping, foreignKey: 'supplier_id' });
Categories.belongsToMany(Supplier, { through: SupplierCategoryMapping, foreignKey: 'category_id' });
Supplier.belongsToMany(Regions,
  { through: SupplierServiceLocationsMappings, foreignKey: 'supplier_id' });
Regions.belongsToMany(Supplier,
   { through: SupplierServiceLocationsMappings, foreignKey: 'region_id' });
*/

module.exports = {
  Countries,
  Regions,
  Role,
  Provincias,
  Supplier,
  Address,
  BusinessAddress,
  SupplierCategoryMapping,
  SupplierServiceLocationsMappings,
  Categories,
};
