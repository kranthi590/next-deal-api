const ExcelJS = require('exceljs');

const logger = require('../../../helpers/logger');

const {
  Categories, Regions, Countries, Comunas,
} = require('../../../helpers/db.models');
const { columns } = require('./buyer.suppliers.download.handler');

const columnsObject = {};
columns.forEach(({
  key,
}, index) => {
  columnsObject[index] = key;
});

const getSupportingData = async () => Promise.all([
  Categories.findAll(),
  Regions.findAll(),
  Countries.findAll(),
  Comunas.findAll(),
]);

const uploadBuyerSuppliersHandler = async (req, res) => {
  const response = {};
  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.load(req.files[0].buffer);
    const worksheet = workbook.getWorksheet('Suppliers');
    worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
      if (rowNumber !== 1) {
        const rowValues = row.values;
        rowValues.shift();
        const supplier = {};
        rowValues.forEach((rowValue, index) => {
          supplier[columnsObject[index]] = rowValue;
        });
        console.log(supplier);
      }
    });
  } catch (error) {
    //  response = InternalServerErrorResponse('', req.traceId);
    logger.error('Error while fetching buyer', error);
  }
  res.status(200).json(response);
};

module.exports = {
  uploadBuyerSuppliersHandler,
};
