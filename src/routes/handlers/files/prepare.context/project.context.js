const { INVALID_PROJECT_ID, BUYER_DOMAIN_BUCKET_FORMAT, FILE_TYPE } = require('../../../../helpers/constants');
const { Projects, Buyers } = require('../../../../helpers/db.models');

const prepareProjectContext = async (req) => {
  const projectResponse = await Projects.findOne({
    where: {
      id: req.body.assetRelationId,
      buyerId: req.user.buyerId,
    },
    include: [
      {
        model: Buyers,
        as: 'buyer',
        attributes: ['subDomainName', 'id'],
      },
    ],
  });
  if (!projectResponse) {
    throw new Error(INVALID_PROJECT_ID);
  }
  const project = projectResponse.toJSON();
  return {
    bucketName: BUYER_DOMAIN_BUCKET_FORMAT.replace('subdomain', `${project.buyer.subDomainName}-${project.buyer.id}`),
    isPublic: false,
    entityId: project.id,
    folder: `project-${project.code}-${project.id}`,
    entityType: FILE_TYPE.PROJECT,
  };
};

module.exports = prepareProjectContext;
