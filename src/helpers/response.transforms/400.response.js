const { formatResponse } = require('./responseFormat');

/**
 * A 400 status response formatter
 * @param  {Object|String} data The data that was requested and being returned.
 * @param  {String}        id   The request UUID attached to the req object at request entry.
 * @param  {String}       [message='Bad Request'] The response message string content.
 * @return {Object}
 */
module.exports = (data, id, message = 'Bad Request') => formatResponse({
  status: 400,
  message,
  data,
  id,
});

/**
 * @swagger
 *  components:
 *    responses:
 *       BadRequest:
 *         description: A 400 response noting bad request input.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/formattedResponse'
 *             example:
 *               id: 123456
 *               status: 400
 *               message: Bad Request
 *               data: {}
 */
