const { FILE_TYPE, BUYER_DOMAIN_BUCKET_FORMAT, INVALID_QUOTATION_ID } = require('../../../../helpers/constants');
const { QuotationsRequest, QuotationsResponse, Projects } = require('../../../../helpers/db.models');

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
        attributes: ['code'],
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
      },
    },
  } = quotation.toJSON();
  return {
    bucketName: BUYER_DOMAIN_BUCKET_FORMAT.replace('subdomain', `${req.user.domain}-${req.user.buyerId}`),
    isPublic: false,
    entityId: id,
    folder: `project-${code}/quotation_requests_${quotationRequestId}/quotation_responses_${id}`,
    entityType: FILE_TYPE.QUOTATION_RESPONSE,
  };
};

module.exports = prepareQuotationResponseContext;
