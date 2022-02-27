const { QUOTATION_STATUS, ACTIVITIES_TYPES } = require('../../../helpers/constants');
const { QuotationsRequest, Activities } = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');
const generateCode = require('../../../helpers/generate.code');
const logger = require('../../../helpers/logger');
const { getConnection } = require('../../../helpers/mysql');
const { OkResponse } = require('../../../helpers/response.transforms');

const saveQuotationWithMappings = async (data) => getConnection().transaction(async (t) => {
  const quotation = await QuotationsRequest.create(data, {
    transaction: t,
    include: ['suppliersMapping'],
  });
  await Activities.create({
    projectId: data.projectId,
    quotationRequestId: quotation.dataValues.id,
    userId: data.createdBy,
    buyerId: data.buyerId,
    activityType: ACTIVITIES_TYPES.QUOTATION_CREATED,
  }, {
    transaction: t,
  });
  return quotation.dataValues;
});

const quotationCreationHandler = async (req, res) => {
  let response;
  try {
    const {
      name,
      startDate,
      expectedEndDate,
      estimatedBudget,
      currency,
      comments,
      suppliers,
    } = req.body;
    const {
      projectId,
    } = req.params;
    const quotation = await saveQuotationWithMappings({
      projectId,
      comments,
      name,
      code: generateCode(name),
      startDate,
      expectedEndDate,
      estimatedBudget,
      currency,
      createdBy: req.user.userId,
      status: QUOTATION_STATUS.CREATED,
      suppliersMapping: suppliers.map((supplier) => ({
        supplier_id: supplier,
      })),
      buyerId: req.user.buyerId,
      isDeleted: false,
    });
    response = OkResponse(quotation, req.traceId);
  } catch (error) {
    console.error(error);
    response = parseError(error, req.traceId, 'quotation_create');
    logger.error('Error while creating quotation request:', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  quotationCreationHandler,
};
