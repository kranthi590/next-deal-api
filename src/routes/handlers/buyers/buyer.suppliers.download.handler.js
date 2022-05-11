const ExcelJS = require('exceljs');
const path = require('path');
const _ = require('lodash');

const logger = require('../../../helpers/logger');

const {
  Suppliers, SupplierCategoryMappings, Addresses,
} = require('../../../helpers/db.models');
const { InternalServerErrorResponse, ForbiddenResponse } = require('../../../helpers/response.transforms');
const { INVALID_BUYER_ID, SUPPLIERS_EXCEL_SHEET_NAME } = require('../../../helpers/constants');

const transformToExcel = (data, worksheet) => {
  data.forEach(({
    rut,
    legalName,
    emailId,
    categories,
    businessAddress,
  }, index) => {
    const categoriesArray = categories.map(({ category: { name } }) => name);
    const rowNumber = index + 6;
    const row = worksheet.getRow(rowNumber);
    row.getCell(1).value = rut;
    row.getCell(2).value = legalName;
    row.getCell(3).value = categoriesArray.join(',');
    row.getCell(4).value = emailId;
    row.getCell(5).value = _.get(businessAddress, 'phoneNumber1', '');
    row.commit();
  });
};

const downloadBuyersSuppliersHandler = async (req, res) => {
  let response;
  try {
    const dataFile = path.join(__dirname, '../../../Suppliers.xlsx');
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
        attributes: ['rut', 'legalName', 'emailId'],
        include: [
          {
            model: Addresses,
            as: 'businessAddress',
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
    // eslint-disable-next-line prefer-template
    res.setHeader('Content-Disposition', 'attachment; filename=Suppliers_' + new Date().getTime() + '.xlsx');
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
