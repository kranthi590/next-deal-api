const {
  invalidStatusCode,
  invalidTraceId,
} = require('../thrownErrors');

/**
 * Formats a JSON response object that is standardized that can be sent as a payload.
 * This allows for manipulation of a returning payload without modifying every
 * endpoint within the application in the future.
 * @memberof responseTransforms
 * @function formatResponse
 * @param  {Object} input
 * @param  {Number} input.status    HTTP status code to send
 * @param  {String} input.message   String message that is human readable about the response.
 * @param  {Object} [input.data={}] The JSON data to be sent back.
 * @param  {String} input.id        The request ID generated when the request was first handled.
 * @return {FormattedResponse}      A JSON object formatted to the standard pattern.
 */
function formatResponse({
  status, message = '', data = {}, id,
}) {
  const responseFormatDefaults = {
    data: {},
    message: '',
  };
  if (!status) { throw new Error(invalidStatusCode); }
  if (!id || id.length === 0) { throw new Error(invalidTraceId); }

  const response = {
    ...responseFormatDefaults,
    status,
    message,
    data,
    id,
  };

  return response;
}

module.exports = {
  formatResponse,
};

/** @namespace responseTransforms */
/**
 * A standard response object definition with default values.
 * @memberof responseTransforms
 * @typedef {Object} FormattedResponse
 * @property {String} id The request id generated when the request was processed.
 * @property {String} [message=''] The textual message sent with the response body.
 * @property {Number} status The numerical status code of the request response being sent.
 * @property {Object} [data={}] An object or array containing any relavent data to the request.
 */

/**
* @swagger
*   components:
*     schemas:
*       formattedResponse:
*         required:
*           - id
*           - status
*         properties:
*           id:
*             type: string
*           status:
*             type: number
*           message:
*             type: string
*           data:
*             type: object
*
*/
