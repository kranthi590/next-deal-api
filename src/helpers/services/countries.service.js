const { Countries, Regions } = require('../db.models');

const fetchCountryByCode = async (countryCode, excludeFields) => {
  const query = {
    include: ['regions'],
    where: {
      active: 1,
      code: countryCode,
    },
    attributes: {},
    raw: true,
    nest: true,
  };
  if (excludeFields) {
    query.attributes.exclude = excludeFields;
  }
  console.log('query', query);
  return Countries.findAll(query);
};

const fetchRegionsByCountryId = async (countryId, excludeFields) => {
  const query = {
    where: {
      country_id: countryId,
    },
    attributes: {},
    raw: true,
    nest: true,
    order: [['order_num', 'ASC']],
  };
  if (excludeFields) {
    query.attributes.exclude = excludeFields;
  }
  return Regions.findAll(query);
};

module.exports = {
  fetchCountryByCode,
  fetchRegionsByCountryId,
};
