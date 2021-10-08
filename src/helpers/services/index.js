const { fetchRegionsByCountryId, fetchCountryByCode } = require('./countries.service');

module.exports = {
  fetchCountryByCode,
  fetchRegionsByCountryId,
};
