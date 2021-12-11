const { INVALID_QUOTATION_ID } = require('../../../helpers/constants');
const { QuotationsRequest, Files } = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');
const { generateFileURL } = require('../../../helpers/generate.file.url');
const logger = require('../../../helpers/logger');
const { OkResponse } = require('../../../helpers/response.transforms');

const getQuotationHandler = async (req, res) => {
  let response;
  try {
    const [quotation, filesMeta] = await Promise.all([
      await QuotationsRequest.findOne({
        where: { id: req.params.quotationRequestId },
      }),
      Files.findAll({
        where: { entityId: req.params.quotationRequestId },
      }),
    ]);
    if (!quotation) {
      throw new Error(INVALID_QUOTATION_ID);
    }
    response = OkResponse({
      ...quotation.dataValues,
      files: generateFileURL(filesMeta),
    }, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while fetching quotation by ID:', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  getQuotationHandler,
};
