const ExcelJS = require('exceljs');
const { INVALID_SHEET_NAME, SUPPLIERS_EXCEL_SHEET_NAME } = require('../../../helpers/constants');
const {
  Categories, Regions, Countries, Comunas,
} = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');

const logger = require('../../../helpers/logger');
const { saveSupplierWithMappings } = require('../suppliers/supplier.register.handler');

const getSupportingData = async () => Promise.all([
  Categories.findAll(),
  Regions.findAll(),
  Countries.findAll(),
  Comunas.findAll(),
]);

const getServiceLocations = (regions, serviceLocationsString) => {
  const serviceLocations = [];
  serviceLocationsString.value.split(';').forEach((serviceLocation) => {
    const region = regions.find(({ name }) => name === serviceLocation.trim());
    if (region) {
      serviceLocations.push(region.id);
    }
  });
  return serviceLocations;
};

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

const getComuna = (comunaName, comunas) => {
  const comunaFound = comunas.find((comuna) => comuna.name === comunaName);
  return comunaFound ? comunaFound.id : null;
};

const getRegion = (regionName, regions) => {
  const regionFound = regions.find((region) => region.name === regionName);
  return regionFound ? regionFound.id : null;
};

const getCountry = (countries) => countries.find((country) => country.code === 'CL').id;

const transformRow = ({
  row, regions, comunas, categories, countries,
}) => ({
  rut: row.getCell(1).value,
  legalName: row.getCell(2).value,
  fantasyName: row.getCell(3).value,
  emailId: typeof row.getCell(8).value === 'object' ? row.getCell(8).value.text : row.getCell(8).value,
  categories: getCategories(categories, row.getCell(5).value),
  serviceLocations: getServiceLocations(regions, row.getCell(4)),
  isShared: row.getCell(6).value.toLowerCase() === 'si',
  type: row.getCell(7).value,
  businessAddress: {
    addressLine1: row.getCell(9).value,
    addressLine2: row.getCell(10).value,
    communeId: getComuna(row.getCell(11).value, comunas),
    regionId: getRegion(row.getCell(12).value, regions),
    countryId: getCountry(countries),
    phoneNumber1: row.getCell(13).value,
    phoneNumber2: row.getCell(14).value,
    emailId: typeof row.getCell(8).value === 'object' ? row.getCell(8).value.text : row.getCell(8).value,
    status: row.getCell(15).value,
    error: row.getCell(16).value,
  },
  comments: ' ',
  rowNumber: row.number,
});

const insertAndCaptureResponse = async (supplier, req) => {
  try {
    await saveSupplierWithMappings(supplier, req.user);
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
      regions,
      countries,
      comunas,
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
        regions,
        comunas,
        countries,
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
      row.getCell(15).value = status;
      row.getCell(16).value = error;
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
