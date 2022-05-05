const { FILE_TYPE, INVALID_QUOTATION_ID } = require('../../../../helpers/constants');
const { QuotationsRequest, QuotationsResponse, Projects } = require('../../../../helpers/db.models');
const { getProjectFolderPath, getBuyerDomainBucket } = require('./project.context');

const getQuotationResponseContext = (user, quotation) => {
  const {
    projectId,
    code,
    quotationRequestId,
    id,
  } = quotation;
  return {
    bucketName: getBuyerDomainBucket(user),
    isPublic: false,
    entityId: id,
    folder: `${getProjectFolderPath(projectId, code)}/quotation_requests_${quotationRequestId}/quotation_responses_${id}`,
    entityType: FILE_TYPE.QUOTATION_RESPONSE,
  };
};

const prepareQuotationResponseContext = async (req) => {
  const quotation = await QuotationsResponse.findOne({
    where: { id: req.body.assetRelationId },
    attributes: ['id'],
    include: [{
      model: QuotationsRequest,
      as: 'quotation',
      attributes: ['id'],
      include: [{
        model: Projects,
        as: 'project',
        attributes: ['code', 'id'],
      }],
    }],
  });
  if (!quotation) {
    throw new Error(INVALID_QUOTATION_ID);
  }
  const {
    id,
    quotation: {
      id: quotationRequestId,
      project: {
        code,
        id: projectId,
      },
    },
  } = quotation.toJSON();
  return getQuotationResponseContext(req.user, {
    projectId,
    code,
    quotationRequestId,
    id,
  });
};

module.exports = {
  prepareQuotationResponseContext,
  getQuotationResponseContext,
};
