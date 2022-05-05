const { getStorage } = require('../../../helpers/bucket.utils');
const {
  INVALID_QUOTATION_ID, QUOTATION_STATUS, QUOTATION_ALREADY_AWARDED,
} = require('../../../helpers/constants');
const {
  QuotationsRequest, QuotationsResponse, Projects, Files,
} = require('../../../helpers/db.models');
const { QuotationToSupplierMappings } = require('../../../helpers/db.models/quotation.supplier.mappings.model');
const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');
const { getConnection } = require('../../../helpers/mysql');
const { OkResponse } = require('../../../helpers/response.transforms');
const { getQuotationResponseContext } = require('../files/prepare.context/quotation.response.context');

const deleteResponseAndUnassignSupplier = async ({
  id,
  supplierId,
  quotationRequestId,
  quotationResponseContext,
}) => getConnection().transaction(async (t) => {
  const {
    entityId,
    bucketName,
    entityType,
    folder,
  } = quotationResponseContext;
  await QuotationsResponse.destroy({
    where: {
      id,
    },
    transaction: t,
  });
  await QuotationToSupplierMappings.destroy({
    where: {
      quotation_request_id: quotationRequestId,
      supplier_id: supplierId,
    },
    transaction: t,
  });
  await Files.destroy({
    where: {
      entityId,
      entityType,
    },
    transaction: t,
  });
  await getStorage()
    .bucket(bucketName)
    .deleteFiles({ prefix: `${folder}/` });
});

const deleteQuotationResponseHandler = async (req, res) => {
  let response;
  try {
    const quotationResponse = await QuotationsResponse.findOne({
      where: {
        id: req.params.quotationResponseId,
      },
      attributes: ['id', 'supplierId', 'quotationRequestId', 'isAwarded'],
      include: [{
        model: QuotationsRequest,
        as: 'quotation',
        attributes: ['status'],
        include: [{
          model: Projects,
          as: 'project',
          attributes: ['id', 'code'],
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
      supplierId,
      quotationRequestId,
      quotation: {
        status,
        project: {
          id: projectId,
          code,
        },
      },
      isAwarded,
    } = quotationResponse.toJSON();
    const quotationResponseContext = getQuotationResponseContext(req.user, {
      projectId,
      code,
      quotationRequestId,
      id,
    });
    if (
      status === QUOTATION_STATUS.AWARDED
      || status === QUOTATION_STATUS.ABORTED
      || status === QUOTATION_STATUS.COMPLETED
    ) {
      throw new Error(`QUOTATION_ALREADY_${status.toUpperCase()}`);
    }
    if (isAwarded) {
      throw new Error(QUOTATION_ALREADY_AWARDED);
    }
    await deleteResponseAndUnassignSupplier({
      id,
      supplierId,
      quotationRequestId,
      quotationResponseContext,
    });
    response = OkResponse({}, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while deleting quotation response by ID:', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  deleteQuotationResponseHandler,
};
