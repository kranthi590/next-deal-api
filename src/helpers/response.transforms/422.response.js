const { formatResponse } = require('./responseFormat');

/**
 * A 200 status repsonse formatter.
 * @param  {Object|String} data The data that was requested and being returned.
 * @param  {String}        id   The request UUID attached to the req object at request entry.
 * @param  {String}       [message='Unprocessable Entity'] The response message string content.
 * @return {Object}
 */
module.exports = (data, id, message = 'Unprocessable Entity') => formatResponse({
  status: 422,
  message,
  data,
  id,
});
/**
 * @swagger
 *  components:
 *    responses:
 *       UnprocessableEntity:
 *         description: The server understands the request but it has validation errors.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/formattedResponse'
 *             example:
 *               id: 123456
 *               status: 422
 *               message: Unprocessable Entity
 *               data: {}
 */
