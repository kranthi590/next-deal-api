const Sequelize = require('sequelize');
const { getConnection } = require('../mysql');

const SupplierServiceLocationsMappings = getConnection().define(
  'supplier_service_locations_mappings',
  {
    supplier_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    region_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  { timestamps: false },
);

module.exports = {
  SupplierServiceLocationsMappings,
};
