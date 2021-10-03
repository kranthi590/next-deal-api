const { Countries, Regions } = require('../helpers/db.models');

const fetchCountryByCode = async (countryCode, excludeFields) => {
  const query = {
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
  return Countries.findOne(query);
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
