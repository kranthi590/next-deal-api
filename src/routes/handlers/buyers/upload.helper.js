const Joi = require('joi');

const { Categories } = require('../../../helpers/db.models');
const { supplierSchemaV2 } = require('../../../helpers/validations/register-supplier');

const getCategories = (categories, categoriesString = '') => {
  const categoriesIds = [];
  categoriesString.split(',').forEach((category) => {
    const categoryFound = categories.find(({ name }) => name === category.trim());
    if (categoryFound) {
      categoriesIds.push(categoryFound.id);
    }
  });
  return categoriesIds;
};

const getSupportingData = async () => Promise.all([
  Categories.findAll(),
]);

const transformRow = ({
  row, categories,
}) => ({
  rut: row.getCell(1).value,
  legalName: row.getCell(2).value,
  emailId: row.getCell(4).value && typeof row.getCell(4).value === 'object'
    ? row.getCell(4).value.text : row.getCell(4).value,
  categories: getCategories(categories, row.getCell(3).value || ''),
  businessAddress: {
    phoneNumber1: row.getCell(5).value,
  },
  rowNumber: row.number,
  isShared: false,
});

const getSuppliers = async (worksheet) => {
  const [
    categories,
  ] = await getSupportingData();
  const rows = [];
  worksheet.eachRow({ includeEmpty: false }, (row) => {
    if (row.number > 5) {
      rows.push(row);
    }
  });
  const suppliers = [];
  rows.forEach(async (row) => {
    const transformedSupplier = transformRow({
      row,
      categories,
      rowNumber: row.number,
    });
    try {
      const schema = Joi.object().keys(supplierSchemaV2).unknown();
      await schema.validateAsync(transformedSupplier, { abortEarly: false });
      transformedSupplier.isRequestValid = true;
    } catch (error) {
      transformedSupplier.error = error.details.map(({ message }) => message).join(',');
      transformedSupplier.isRequestValid = false;
    }
    suppliers.push(transformedSupplier);
  });
  return suppliers;
};

module.exports = {
  getSupportingData,
  transformRow,
  getSuppliers,
};
