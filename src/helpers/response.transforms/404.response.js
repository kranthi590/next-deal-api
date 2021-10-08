const { formatResponse } = require('./responseFormat');

/**
 * A 404 status response formatter.
 * @param  {Object|String} data The data that was requested and being returned.
 * @param  {String}        id   The request UUID attached to the req object at request entry.
 * @param  {String}       [message='Not Found'] The response message string content.
 * @return {Object}
 */
module.exports = (data, id, message = 'Not Found') => formatResponse({
  status: 404,
  message,
  data,
  id,
});

/**
 * @swagger
 *  components:
 *    responses:
 *       NotFound:
 *         description: The server can't find the requested resource.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/formattedResponse'
 *             example:
 *               id: 123456
 *               status: 404
 *               message: Not Found
 *               data: {}
 */
