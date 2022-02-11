const { Activities } = require('../../../helpers/db.models');
const { parseError } = require('../../../helpers/error.parser');
const logger = require('../../../helpers/logger');
const { OkResponse } = require('../../../helpers/response.transforms');

const activitiesListHandler = async (req, res) => {
  let response;
  try {
    const activities = await Activities.findAll({
      where: {
        quotationRequestId: req.params.quotationRequestId,
        buyerId: req.user.buyerId,
      },
      attributes: [
        'activityType',
        'activityText',
        'id',
        'createdAt',
      ],
    });
    response = OkResponse(activities, req.traceId);
  } catch (error) {
    response = parseError(error, req.traceId);
    logger.error('Error while fetching activities', error);
  }
  res.status(response.status).json(response);
};

module.exports = {
  activitiesListHandler,
};
