const { INVALID_PROJECT_ID, BUYER_DOMAIN_BUCKET_FORMAT, FILE_TYPE } = require('../../../../helpers/constants');
const { Projects, Buyers } = require('../../../../helpers/db.models');

const getProjectFolderPath = (id, code) => `project-${code}-${id}`;

const getBuyerDomainBucket = (user) => {
  if (!user) {
    throw Error();
  }
  return BUYER_DOMAIN_BUCKET_FORMAT.replace('subdomain', `${user.domain}-${user.buyerId}`);
};

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
    bucketName: getBuyerDomainBucket(req.user),
    isPublic: false,
    entityId: project.id,
    folder: getProjectFolderPath(project.id, project.code),
    entityType: FILE_TYPE.PROJECT,
  };
};

module.exports = {
  prepareProjectContext,
  getProjectFolderPath,
  getBuyerDomainBucket,
};
