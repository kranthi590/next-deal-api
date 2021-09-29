const { Countries } = require('./country.model');
const { Regions } = require('./regions.model');

Regions.belongsTo(Countries, { foreignKey: 'country_id' });

module.exports = {
  Countries,
  Regions,
};
