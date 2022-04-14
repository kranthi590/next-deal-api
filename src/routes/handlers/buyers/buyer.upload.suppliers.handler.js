const ExcelJS = require('exceljs');

const {
  INVALID_SHEET_NAME, SUPPLIERS_EXCEL_SHEET_NAME,
} = require('../../../helpers/constants');
const {
  Categories,
} = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');

const logger = require('../../../helpers/logger');
const { saveSupplierWithMappings } = require('../suppliers/supplier.register.handler');

const getSupportingData = async () => Promise.all([
  Categories.findAll(),
]);

const getCategories = (categories, categoriesString) => {
  const categoriesIds = [];
  categoriesString.split(';').forEach((category) => {
    const categoryFound = categories.find(({ name }) => name === category.trim());
    if (categoryFound) {
      categoriesIds.push(categoryFound.id);
    }
  });
  return categoriesIds;
};

const transformRow = ({
  row, categories,
}) => ({
  rut: row.getCell(1).value,
  legalName: row.getCell(2).value,
  emailId: typeof row.getCell(4).value === 'object' ? row.getCell(4).value.text : row.getCell(4).value,
  categories: getCategories(categories, row.getCell(3).value),
  businessAddress: {
    phoneNumber1: row.getCell(5).value,
  },
  rowNumber: row.number,
  isShared: false,
});

const insertAndCaptureResponse = async (supplier, req) => {
  try {
    await saveSupplierWithMappings(supplier, req);
    return {
      status: 'OK',
      rowNumber: supplier.rowNumber,
    };
  } catch (error) {
    const errorMessage = parseError(error, req.traceId);
    return {
      status: 'NOT_OK',
      error: errorMessage.errors && errorMessage.errors[0]
        ? errorMessage.errors[0].errorCode : errorMessage.errors,
      rowNumber: supplier.rowNumber,
    };
  }
};

const uploadBuyerSuppliersHandler = async (req, res) => {
  let response;
  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.load(req.files[0].buffer);
    const worksheet = workbook.getWorksheet(SUPPLIERS_EXCEL_SHEET_NAME);
    if (!worksheet) {
      throw new Error(INVALID_SHEET_NAME);
    }
    const [
      categories,
    ] = await getSupportingData();
    const rows = [];
    worksheet.eachRow({ includeEmpty: false }, (row) => {
      if (row.number !== 1 && row.number !== 2 && row.number !== 3) {
        rows.push(row);
      }
    });
    const suppliers = [];
    rows.forEach((row) => {
      suppliers.push(transformRow({
        row,
        categories,
        rowNumber: row.number,
      }));
    });
    // eslint-disable-next-line max-len
    const responses = await Promise.all(suppliers.map((supplier) => insertAndCaptureResponse(supplier, req)));
    responses.forEach(({
      rowNumber,
      status,
      error,
    }) => {
      const row = worksheet.getRow(rowNumber);
      row.getCell(6).value = status;
      row.getCell(7).value = error;
      row.commit();
    });
    res.status(200);
    res.setHeader('Content-Type', 'application/vnd.ms-excel.sheet.macroenabled.12');
    // eslint-disable-next-line prefer-template
    res.setHeader('Content-Disposition', 'attachment; filename=Suppliers_' + new Date().getTime() + '.xlsx');
    workbook.xlsx.write(res)
      .then(() => {
        res.end();
      });
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while bulk upload suppliers', error);
    res.status(response.status).json(response);
  }
};

module.exports = {
  uploadBuyerSuppliersHandler,
};
