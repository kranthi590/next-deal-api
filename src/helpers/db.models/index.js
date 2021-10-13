const {
  Countries, Regions, Provincias, Comunas,
} = require('./country.model');

const { Role } = require('./role.model');
const { Supplier } = require('./supplier.model');
const { Address, BusinessAddress } = require('./address.model');

Countries.hasMany(Regions, { as: 'region', foreignKey: 'country_id' });
Provincias.hasMany(Comunas, { as: 'comuna', foreignKey: 'provincia_id' });

module.exports = {
  Countries,
  Regions,
  Role,
  Provincias,
  Supplier,
  Address,
  BusinessAddress,
};
