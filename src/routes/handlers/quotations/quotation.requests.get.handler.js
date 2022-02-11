const { INVALID_QUOTATION_ID, FILE_TYPE } = require('../../../helpers/constants');
const { QuotationsRequest, Files, Projects } = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');
const { generateFileURL } = require('../../../helpers/generate.file.url');
const logger = require('../../../helpers/logger');
const { OkResponse } = require('../../../helpers/response.transforms');

const getQuotationHandler = async (req, res) => {
  let response;
  try {
    const [quotation, filesMeta] = await Promise.all([
      await QuotationsRequest.findOne({
        where: { id: req.params.quotationRequestId, isDeleted: false },
        include: [
          {
            model: Projects,
            as: 'project',
            attributes: [],
            where: {
              buyerId: req.user.buyerId,
              isDeleted: false,
            },
          },
        ],
      }),
      Files.findAll({
        where: {
          entityId: req.params.quotationRequestId,
          entityType: FILE_TYPE.QUOTATION_REQUEST,
        },
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
