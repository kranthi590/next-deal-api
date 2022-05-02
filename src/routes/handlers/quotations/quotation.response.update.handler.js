const Joi = require('joi');
const { INVALID_QUOTATION_ID, QUOTATION_STATUS } = require('../../../helpers/constants');
const { QuotationsResponse, QuotationsRequest, Projects } = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');
const { OkResponse } = require('../../../helpers/response.transforms');
const { inProgressOrCreatedSchema, awardedQuotationSchema } = require('../../../helpers/validations/quotation-response-update');

const quotationResponseUpdateHandler = async (req, res) => {
  let response;
  try {
    const {
      quotationResponseId,
    } = req.params;
    const {
      netWorth,
      currency,
      includesTax,
      incoterm,
      paymentCondition,
      deliveryDate,
      validityDate,
      comments,
      purchaseOrderNumber,
    } = req.body;
    const quotationResponse = await QuotationsResponse.findOne({
      where: {
        id: quotationResponseId,
      },
      attributes: ['id', 'isAwarded'],
      include: [{
        model: QuotationsRequest,
        as: 'quotation',
        attributes: ['status'],
        include: [{
          model: Projects,
          as: 'project',
          attributes: [],
          where: {
            buyerId: req.user.buyerId,
          },
          required: true,
        }],
        required: true,
      }],
    });
    if (!quotationResponse) {
      throw new Error(INVALID_QUOTATION_ID);
    }
    const {
      id,
      quotation: { status },
      isAwarded,
    } = quotationResponse.toJSON();
    if (status === QUOTATION_STATUS.ABORTED || status === QUOTATION_STATUS.COMPLETED) {
      throw new Error(`QUOTATION_ALREADY_${status.toUpperCase()}`);
    }
    const schema = Joi.object()
      .keys(isAwarded ? awardedQuotationSchema : inProgressOrCreatedSchema)
      .unknown();
    await schema.validateAsync({
      netWorth,
      currency,
      includesTax,
      incoterm,
      paymentCondition,
      deliveryDate,
      validityDate,
      comments,
      purchaseOrderNumber,
    }, { abortEarly: false });
    await QuotationsResponse.update(
      isAwarded ? {
        purchaseOrderNumber,
        deliveryDate,
        comments,
      } : {
        netWorth,
        currency,
        includesTax,
        incoterm,
        paymentCondition,
        deliveryDate,
        validityDate,
        comments,
      },
      {
        where: { id },
      },
    );
    response = OkResponse({}, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while updating quotation response:', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  quotationResponseUpdateHandler,
};
