//  const { Sequelize } = require('sequelize');
const { DB_FETCH_SIZE, DB_OFFSET_DEFAULT, FILE_TYPE } = require('../../../helpers/constants');
const { QuotationsResponse, Suppliers, Files } = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');
const { generateFileURL } = require('../../../helpers/generate.file.url');
const logger = require('../../../helpers/logger');
const { OkResponse } = require('../../../helpers/response.transforms');

const quotationResponsesListHandler = async (req, res) => {
  let response;
  try {
    const limit = req.query.size ? parseInt(req.query.size, 10) : DB_FETCH_SIZE;
    const offset = req.query.size ? parseInt(req.query.offset, 10) : DB_OFFSET_DEFAULT;
    const quotations = await QuotationsResponse.findAndCountAll({
      where: {
        quotationRequestId: req.params.quotationRequestId,
        isDeleted: false,
      },
      limit,
      offset,
      attributes: [
        'id', 'netWorth', 'paymentCondition', 'includesTax', 'incoterm', 'currency',
        'deliveryDate', 'validityDate', 'additionalData', 'isAwarded', 'comments',
        'purchaseOrderNumber',
      ],
      // order: [
      //   [Sequelize.literal('updated_at'), 'desc'],
      // ],
      include: [{
        model: Suppliers,
        as: 'supplier',
        attributes: ['id', 'fantasyName'],
      }, {
        model: Files,
        as: 'files',
        required: false,
        where: {
          entityType: FILE_TYPE.QUOTATION_RESPONSE,
        },
        attributes: [
          'isPublic',
          'fileLocation',
          'id',
          'name',
          'mimeType',
          'bucketName',
        ],
      }],
    });
    quotations.limit = limit;
    quotations.offset = offset;
    const quotationsData = quotations.rows.map(({ dataValues: { files, ...rest } }) => ({
      ...rest,
      files: generateFileURL(files),
    }));
    quotations.rows = quotationsData;
    response = OkResponse(quotations, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while fetching quotation responses', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  quotationResponsesListHandler,
};
