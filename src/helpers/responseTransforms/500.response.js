const { formatResponse } = require('./responseFormat');

/**
 * A 500 status response formatter.
 * @param  {Object|String} data The data that was requested and being returned.
 * @param  {String}        id   The request UUID attached to the req object at request entry.
 * @param  {String}       [message='Internal Server Error'] The response message string content.
 * @return {Object}
 */
module.exports = (data, id, message = 'Internal Server Error') => formatResponse({
  status: 500,
  message,
  data,
  id,
});
/**
 * @swagger
 *  components:
 *    responses:
 *       InternalError:
 *         description: An error occurred within the server or with some external services.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/formattedResponse'
 *             example:
 *               id: 123456
 *               status: 500
 *               message: Internal Server Error
 *               data: {}
 */
