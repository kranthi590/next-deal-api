const { formatResponse } = require('./responseFormat');

/**
 * A 401 status response formatter
 * @param  {Object|String} data The data that was requested and being returned.
 * @param  {String}        id   The request UUID attached to the req object at request entry.
 * @param  {String}       [message='Unauthorized'] The response message string content.
 * @return {Object}
 */
module.exports = (data, id, message = 'Unauthorized') => formatResponse({
  status: 401,
  message,
  data,
  id,
});

/**
 * @swagger
 *  components:
 *    responses:
 *       Unauthorized:
 *         description: The request has not been applied because it lacks valid authentication
 *                      credentials for the target resource.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/formattedResponse'
 *             example:
 *               id: 123456
 *               status: 401
 *               message: Unauthorized
 *               data: {}
 */
