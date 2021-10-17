const Sequelize = require('sequelize');

module.exports = (sequelize) => ({
  SupplierServiceLocationsMappings: sequelize.define(
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
  ),
});
