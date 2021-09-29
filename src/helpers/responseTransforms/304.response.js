const { formatResponse } = require('./responseFormat');

/**
 * A 304 status repsonse formatter.
 * @param  {Object|String} data The data that was requested and being returned.
 * @param  {String}        id   The request UUID attached to the req object at request entry.
 * @param  {String}       [message='Not Modified'] The response message string content.
 * @return {Object}
 */
module.exports = (data, id, message = 'Not Modified') => formatResponse({
  status: 304,
  message,
  data,
  id,
});

/**
 * @swagger
 *  components:
 *    responses:
 *      NotModified:
 *        description: Returns a simple 304 response with the default JSON body.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/formattedResponse'
 *            example:
 *              id: 123456
 *              status: 304
 *              message: Not Modified
 *              data: {}
 */
