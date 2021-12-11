const { FILE_TYPE, BUYER_DOMAIN_BUCKET_FORMAT, INVALID_QUOTATION_ID } = require('../../../../helpers/constants');
const { QuotationsRequest } = require('../../../../helpers/db.models');

const prepareQuotationRequestContext = async (req) => {
  const quotation = await QuotationsRequest.findOne({
    where: { id: req.body.assetRelationId },
    include: ['project'],
  });
  if (!quotation) {
    throw new Error(INVALID_QUOTATION_ID);
  }
  return {
    bucketName: BUYER_DOMAIN_BUCKET_FORMAT.replace('subdomain', `${req.user.domain}-${req.user.buyerId}`),
    isPublic: false,
    entityId: quotation.dataValues.id,
    folder: `project-${quotation.dataValues.project.code}/quotation_requests_${quotation.dataValues.id}`,
    entityType: FILE_TYPE.QUOTATION_REQUEST,
  };
};

module.exports = prepareQuotationRequestContext;
