const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  const Countries = sequelize.define(
    'countries',
    {
      name: Sequelize.STRING,
      code: {
        type: Sequelize.STRING,
        unique: true,
      },
      active: Sequelize.BOOLEAN,
      createdAt: {
        type: Sequelize.DATE,
        field: 'created_at',
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        field: 'updated_at',
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      description: Sequelize.STRING,
    },
    { timestamps: true },
  );

  const Regions = sequelize.define(
    'regions',
    {
      name: Sequelize.STRING,
      ordinal: Sequelize.STRING,
      createdAt: {
        type: Sequelize.DATE,
        field: 'created_at',
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        field: 'updated_at',
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      orderNum: {
        field: 'order_num',
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      countryId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'country_id',
        foreignKey: true,
        references: {
          model: 'countries',
          key: 'id',
        },
      },
      description: Sequelize.STRING,
    },
    { timestamps: true },
  );

  const Comunas = sequelize.define(
    'comunas',
    {
      name: {
        type: Sequelize.STRING,
        unique: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        field: 'created_at',
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        field: 'updated_at',
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      regionId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'region_id',
        foreignKey: true,
        references: {
          model: 'regions',
          key: 'id',
        },
      },
    },
    { timestamps: true },
  );

  Regions.hasMany(Comunas, { as: 'comunas', foreignKey: 'region_id', targetKey: 'id' });
  Countries.hasMany(Regions, { as: 'regions', foreignKey: 'country_id', targetKey: 'id' });

  return {
    Comunas,
    Countries,
    Regions,
  };
};
