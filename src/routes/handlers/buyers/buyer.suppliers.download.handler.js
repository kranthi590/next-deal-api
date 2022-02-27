const ExcelJS = require('exceljs');
const path = require('path');
const _ = require('lodash');

const logger = require('../../../helpers/logger');

const {
  Suppliers, SupplierCategoryMappings, SupplierServiceLocationsMappings, Addresses,
} = require('../../../helpers/db.models');
const { InternalServerErrorResponse, ForbiddenResponse } = require('../../../helpers/response.transforms');
const { INVALID_BUYER_ID, SUPPLIERS_EXCEL_SHEET_NAME } = require('../../../helpers/constants');

const transformToExcel = (data, worksheet) => {
  data.forEach(({
    rut,
    legalName,
    fantasyName,
    isShared,
    type,
    emailId,
    businessAddress,
    serviceLocations,
    categories,
  }, index) => {
    // eslint-disable-next-line max-len
    const serviceLocationsArray = serviceLocations.map(({ region: { description } }) => description);
    const categoriesArray = categories.map(({ category: { name } }) => name);
    const rowNumber = index + 4;
    const row = worksheet.getRow(rowNumber);
    row.getCell(1).value = rut;
    row.getCell(2).value = legalName;
    row.getCell(3).value = fantasyName;
    row.getCell(4).value = serviceLocationsArray.join(',');
    row.getCell(5).value = categoriesArray.join(',');
    row.getCell(6).value = isShared ? 'Si' : 'No';
    row.getCell(7).value = type;
    row.getCell(8).value = emailId;
    row.getCell(9).value = _.get(businessAddress, 'addressLine2', '');
    row.getCell(10).value = _.get(businessAddress, 'addressLine1', '');
    row.getCell(11).value = _.get(businessAddress, 'comuna.name', '');
    row.getCell(12).value = _.get(businessAddress, 'region.name', '');
    row.getCell(13).value = _.get(businessAddress, 'phoneNumber1', '');
    row.getCell(14).value = _.get(businessAddress, 'phoneNumber2', '');
    row.commit();
  });
};

const downloadBuyersSuppliersHandler = async (req, res) => {
  let response;
  try {
    const dataFile = path.join(__dirname, '../../../Suppliers.xlsm');
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(dataFile);
    const worksheet = workbook.getWorksheet(SUPPLIERS_EXCEL_SHEET_NAME);
    if (req.params.buyerId !== req.user.buyerId.toString()) {
      response = ForbiddenResponse(INVALID_BUYER_ID, req.traceId);
    } else {
      const query = {
        where: {
          buyerId: req.user.buyerId,
        },
        attributes: ['rut', 'legalName', 'fantasyName', 'isShared', 'type', 'emailId'],
        include: [
          {
            model: Addresses,
            as: 'businessAddress',
            include: ['region', 'comuna', 'country'],
          },
          {
            model: SupplierServiceLocationsMappings,
            as: 'serviceLocations',
            include: ['region'],
          },
          {
            model: SupplierCategoryMappings,
            as: 'categories',
            include: ['category'],
          },
        ],
      };
      const suppliers = await Suppliers.findAll(query);
      transformToExcel(suppliers, worksheet);
    }
    res.status(200);
    res.setHeader('Content-Type', 'application/vnd.ms-excel.sheet.macroenabled.12');
    res.setHeader('Content-Disposition', 'attachment; filename=Proveedores.xlsx');
    workbook.xlsx.write(res)
      .then(() => {
        res.end();
      });
  } catch (error) {
    response = InternalServerErrorResponse('', req.traceId);
    logger.error('Error while downloading buyers supplier', error);
    res.status(response.status).json(response);
  }
};

module.exports = {
  downloadBuyersSuppliersHandler,
};
