const ExcelJS = require('exceljs');
const _ = require('lodash');

const {
  INVALID_SHEET_NAME, SUPPLIERS_EXCEL_SHEET_NAME,
} = require('../../../helpers/constants');

const { parseError } = require('../../../helpers/error.parser');

const logger = require('../../../helpers/logger');
const { saveSupplierWithMappings } = require('../suppliers/supplier.register.handler');
const { getSuppliers } = require('./upload.helper');

const insertAndCaptureResponse = async (supplier, req) => {
  try {
    await saveSupplierWithMappings(supplier, req);
    return {
      status: 'OK',
      rowNumber: supplier.rowNumber,
    };
  } catch (error) {
    const errorMessage = parseError(error, req.traceId);
    const displayErrorText = _.get(errorMessage, 'data.original.sqlMessage', null);
    return {
      status: 'NOT_OK',
      error: displayErrorText || error.message,
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
    const suppliers = await getSuppliers(worksheet);
    const responses = await Promise.all(suppliers.map((supplier) => {
      if (supplier.isRequestValid) {
        return insertAndCaptureResponse(supplier, req);
      }
      return Promise.resolve({
        status: 'NOT_OK',
        error: supplier.error,
        rowNumber: supplier.rowNumber,
      });
    }));
    responses.forEach(({
      rowNumber,
      status,
      error,
    }) => {
      const row = worksheet.getRow(rowNumber);
      row.getCell(6).value = status;
      row.getCell(7).value = error || '';
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
