const { Sequelize } = require('sequelize');
const { ACTIVITIES_TYPES, QUOTATION_STATUS, INVALID_QUOTATION_ID } = require('../../../helpers/constants');
const {
  QuotationsResponse, Activities, QuotationsRequest, Projects,
} = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');
const { getConnection } = require('../../../helpers/mysql');
const { OkResponse } = require('../../../helpers/response.transforms');

const createQuotationResponse = async (data) => getConnection().transaction(async (t) => {
  const promisesArray = [
    QuotationsResponse.create(data, {
      transaction: t,
    }),
    Activities.create({
      projectId: data.projectId,
      quotationRequestId: data.quotationRequestId,
      userId: data.createdBy,
      buyerId: data.buyerId,
      activityType: ACTIVITIES_TYPES.QUOTATION_RESPONSE_CREATED,
    }, {
      transaction: t,
    }),
  ];
  if (data.responsesCount === 0) {
    promisesArray.push(QuotationsRequest.update(
      { status: QUOTATION_STATUS.IN_PROGRESS },
      {
        where: { id: data.quotationRequestId },
        transaction: t,
        returning: true,
      },
    ));
  }
  const [quotation] = await Promise.all(promisesArray);
  return quotation;
});

const quotationResponseCreationHandler = async (req, res) => {
  let response;
  try {
    const {
      supplierId,
      netWorth,
      currency,
      includesTax,
      incoterm,
      paymentCondition,
      deliveryDate,
      validityDate,
      comments,
    } = req.body;
    const {
      quotationRequestId,
    } = req.params;
    const quotationRequest = await QuotationsRequest.findOne({
      where: {
        id: quotationRequestId,
        isDeleted: false,
      },
      attributes: [
        'id',
        'projectId',
        [Sequelize.fn('COUNT', Sequelize.col('quotationResponse.id')), 'quotationsCount'],
      ],
      include: [{
        model: QuotationsResponse,
        as: 'quotationResponse',
        attributes: [],
      }, {
        model: Projects,
        as: 'project',
        where: {
          buyerId: req.user.buyerId,
          isDeleted: false,
        },
      }],
      group: ['quotation_requests.id'],
    });
    if (!quotationRequest) {
      throw new Error(INVALID_QUOTATION_ID);
    }
    const { id, projectId, quotationsCount } = quotationRequest.toJSON();
    const quotation = await createQuotationResponse({
      supplierId,
      netWorth,
      currency,
      includesTax,
      incoterm,
      paymentCondition,
      deliveryDate,
      validityDate,
      comments,
      quotationRequestId: id,
      createdBy: req.user.userId,
      isAwarded: false,
      buyerId: req.user.buyerId,
      projectId,
      responsesCount: quotationsCount,
    });
    response = OkResponse(quotation, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while creating quotation response:', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  quotationResponseCreationHandler,
};
