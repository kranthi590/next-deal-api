const { Countries, Regions } = require('./country.model');
const { ContactInfo } = require('./contact.info.model');
const { Role } = require('./role.model');

Regions.belongsTo(Countries, { foreignKey: 'country_id' });
ContactInfo.hasOne(Role, { as: 'role', foreignKey: 'role_id' });
Role.belongsTo(ContactInfo, {
  foreignKey: 'role_id',
  as: 'contact_info',
});

module.exports = {
  Countries,
  Regions,
  ContactInfo,
  Role,
};
