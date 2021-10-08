const Sequelize = require('sequelize');
const { getConnection } = require('../mysql');

const Countries = getConnection().define('countries', {
  name: Sequelize.STRING,
  code: {
    type: Sequelize.STRING,
    unique: true,
  },
  active: Sequelize.BOOLEAN,
  created_at: Sequelize.DATE,
  updated_at: Sequelize.DATE,
  description: Sequelize.STRING,
}, { timestamps: false });

const Regions = getConnection().define('regions', {
  name: Sequelize.STRING,
  ordinal: Sequelize.STRING,
  country_id: Sequelize.INTEGER,
  created_at: Sequelize.DATE,
  updated_at: Sequelize.DATE,
  order_num: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
}, { timestamps: false });

const Provincias = getConnection().define('provincias', {
  name: {
    type: Sequelize.STRING,
    unique: true,
  },
  region_id: Sequelize.STRING,
  created_at: Sequelize.DATE,
  updated_at: Sequelize.DATE,
}, { timestamps: false });

Countries.hasMany(Regions, { as: 'regions', foreignKey: 'country_id' });

Regions.belongsTo(Countries, {
  foreignKey: 'country_id',
  as: 'country',
});

const Comunas = getConnection().define('comunas', {
  name: {
    type: Sequelize.STRING,
    unique: true,
  },
  provincia_id: Sequelize.INTEGER,
  created_at: Sequelize.DATE,
  updated_at: Sequelize.DATE,
}, { timestamps: false });

module.exports = {
  Countries,
  Regions,
  Provincias,
  Comunas,
};
