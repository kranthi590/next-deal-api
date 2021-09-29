const { formatResponse } = require('./responseFormat');

/**
 * A 200 status response formatter.
 * @memberof responseTransforms
 * @function OkResponse
 * @param  {Object|Array} data The data that was requested and being returned.
 * @param  {String}        id   The request UUID attached to the req object at request entry.
 * @param  {String}       [message='Response OK'] The response message string content.
 * @return {OkResponseObject}
 */
module.exports = (data, id, message = 'Response OK') => formatResponse({
  status: 200,
  message,
  data,
  id,
});

/**
 * 200 service response.
 * @memberof responseTransforms
 * @typedef {object} OkResponseObject
 * @property {Number} status=200
 * @property {String} [message='Response Ok']
 * @property {String} id
 * @property {Object | Array} [data={}]
 */
/**
 * @swagger
 *  components:
 *    responses:
 *      Ok:
 *        description: Returns a simple 200 response with the default JSON body.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/formattedResponse'
 *            example:
 *              id: 123456
 *              status: 200
 *              message: Response Ok
 *              data: {}
 */
