const logger = require('./logger');
const countries = require('./data/country.data.json');
const CategoriesData = require('./data/categories.data.json');

const checkAndInsertData = async (CountryModels, CategoryModel) => {
  const comunasCount = await CountryModels.Comunas.count();
  if (comunasCount === 0) {
    logger.info('Countries data is not found in, inserting....');
    const country = await CountryModels.Countries.create({
      name: countries[0].name,
      code: countries[0].code,
    });
    const regions = countries[0].regions.map(
      ({
        name, romanNumber, number, abbreviation, communes,
      }) => ({
        name,
        ordinal: romanNumber,
        orderNum: number,
        countryId: country.dataValues.id,
        description: `${name}(${abbreviation})`,
        comunas: communes.map((commune) => ({ name: commune.name })),
      }),
    );
    await CountryModels.Regions.bulkCreate(regions, {
      include: ['comunas'],
    });
  }
  const categoriesCount = await CategoryModel.Categories.count();
  if (categoriesCount === 0) {
    await CategoryModel.Categories.bulkCreate(CategoriesData);
  }
};

module.exports = {
  checkAndInsertData,
};
