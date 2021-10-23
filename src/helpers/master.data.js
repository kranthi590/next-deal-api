const logger = require('./logger');
const countries = require('./data/country.data.json');
const CategoriesData = require('./data/categories.data.json');
const RolesData = require('./data/roles.data.json');

const {
  Comunas, Countries, Regions, Categories, Roles,
} = require('./db.models');

const checkAndInsertData = async () => {
  const comunasCount = await Comunas.count();
  if (comunasCount === 0) {
    logger.info('Countries data is not found in, inserting....');
    const regions = countries[0].regions.map(
      ({
        name, romanNumber, number, abbreviation, communes,
      }) => ({
        name,
        ordinal: romanNumber,
        orderNum: number,
        description: `${name}(${abbreviation})`,
        comunas: communes.map((commune) => ({ name: commune.name })),
      }),
    );
    const countriesData = [
      {
        name: countries[0].name,
        code: countries[0].code,
        regions,
      },
    ];
    await Countries.bulkCreate(countriesData, {
      include: [
        {
          model: Regions,
          include: [Comunas],
        },
      ],
    });
  }
  const categoriesCount = await Categories.count();
  if (categoriesCount === 0) {
    await Categories.bulkCreate(CategoriesData);
  }

  const rolesCount = await Roles.count();
  if (rolesCount === 0) {
    await Roles.bulkCreate(RolesData);
  }
};

module.exports = {
  checkAndInsertData,
};
