const ExcelJS = require('exceljs');
const { INVALID_DOMAIN } = require('../helpers/constants');
const { ForbiddenResponse } = require('../helpers/response.transforms');
const logger = require('../helpers/logger');

const downloadExcel = (req, res) => {
  try {
    const {
      excelData: {
        columns,
        rows,
        worksheetName,
      },
    } = req;
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(worksheetName);
    worksheet.columns = columns;

    // Add Array Rows
    worksheet.addRows(rows);

    // res is a Stream object
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=Suppliers.xlsx',
    );

    workbook.xlsx.write(res).then(() => {
      res.status(200).end();
    });
  } catch (err) {
    logger.error('Error while preparing excel', err);
    const resp = ForbiddenResponse(INVALID_DOMAIN, req.traceId);
    res.status(resp.status).json(resp);
  }
};

module.exports = downloadExcel;
