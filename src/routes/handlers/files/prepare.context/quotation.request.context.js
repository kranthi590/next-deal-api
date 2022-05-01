const { FILE_TYPE, INVALID_QUOTATION_ID } = require('../../../../helpers/constants');
const { QuotationsRequest } = require('../../../../helpers/db.models');
const { getProjectFolderPath, getBuyerDomainBucket } = require('./project.context');

const prepareQuotationRequestContext = async (req) => {
  const quotation = await QuotationsRequest.findOne({
    where: { id: req.body.assetRelationId },
    include: ['project'],
  });
  if (!quotation) {
    throw new Error(INVALID_QUOTATION_ID);
  }
  return {
    bucketName: getBuyerDomainBucket(req.user),
    isPublic: false,
    entityId: quotation.dataValues.id,
    folder: `${getProjectFolderPath(quotation.dataValues.project.id, quotation.dataValues.project.code)}/quotation_requests_${quotation.dataValues.id}`,
    entityType: FILE_TYPE.QUOTATION_REQUEST,
  };
};

module.exports = prepareQuotationRequestContext;
