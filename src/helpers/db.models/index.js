const { Countries, Regions, Comunas } = require('./country.model');

const { Role } = require('./role.model');
const { Supplier } = require('./supplier.model');
const { Address, BusinessAddress } = require('./address.model');
const { SupplierCategoryMapping } = require('./supplier.category.mapping.model');
const { SupplierServiceLocationsMappings } = require('./supplier.service.locations.mappings.model');
const { Categories } = require('./categories');
const { Buyer } = require('./buyer.model');
const { User } = require('./user.model');
const { UsersRolesMapping } = require('./user.roles.mapping');

Regions.hasMany(Comunas, { foreignKey: 'region_id', targetKey: 'id' });
Regions.belongsTo(Countries);

Countries.hasMany(Regions, { foreignKey: 'country_id', targetKey: 'id' });

Buyer.belongsTo(BusinessAddress, {
  as: 'businessAddress',
  foreignKey: 'contact_info_id',
  targetKey: 'id',
});
User.belongsTo(BusinessAddress, {
  as: 'businessAddress',
  foreignKey: 'contact_info_id',
  targetKey: 'id',
});

User.hasMany(UsersRolesMapping, { as: 'roleMap', foreignKey: 'user_id', targetKey: 'id' });
User.belongsTo(Buyer, { as: 'buyer', foreignKey: 'buyer_id', targetKey: 'id' });

module.exports = {
  Countries,
  Regions,
  Role,
  Supplier,
  Address,
  BusinessAddress,
  SupplierCategoryMapping,
  SupplierServiceLocationsMappings,
  Categories,
  Buyer,
  User,
  UsersRolesMapping,
  Comunas,
};
