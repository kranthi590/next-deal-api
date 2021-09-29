const { formatResponse } = require('./responseFormat');

/**
 * A 403 status response formatter
 * @param  {Object|String} data The data that was requested and being returned.
 * @param  {String}        id   The request UUID attached to the req object at request entry.
 * @param  {String}       [message='Forbidden'] The response message string content.
 * @return {Object}
 */
module.exports = (data, id, message = 'Forbidden') => formatResponse({
  status: 403,
  message,
  data,
  id,
});

/**
 * @swagger
 *  components:
 *    responses:
 *       Forbidden:
 *         description: the server understood the request but refuses to authorize it.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/formattedResponse'
 *             example:
 *               id: 123456
 *               status: 403
 *               message: Forbidden
 *               data: {}
 */
