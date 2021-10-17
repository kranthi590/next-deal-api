const { checkAndInsertData } = require('../master.data');

let Comunas;
let Regions;
let Countries;

const init = async (sequelize) => {
  const CountryModels = require('./country.model')(sequelize);
  const CategoryModel = require('./categories')(sequelize);

  await sequelize.sync({ force: false });
  Comunas = CountryModels.Comunas;
  Regions = CountryModels.Regions;
  Countries = CountryModels.Countries;
  await checkAndInsertData(CountryModels, CategoryModel);
};

module.exports = {
  initModels: init,
  Comunas,
  Regions,
  Countries,
};
