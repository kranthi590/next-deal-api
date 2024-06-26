const Multer = require('multer');
const { INVALID_FILE_TYPE } = require('../helpers/constants');
const logger = require('../helpers/logger');
const { BadRequestResponse } = require('../helpers/response.transforms');

// const getAllowedExtensions = (routePath) => {
//   switch (true) {
//     case routePath === '/api/v1/suppliers':
//       return IMAGES_EXTENSIONS;
//     default:
//       return IMAGES_EXTENSIONS;
//   }
// };

const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
  // fileFilter: (req, file, cb) => {
  //   if (getAllowedExtensions(req.originalUrl).includes(file.mimetype)) {
  //     return cb(null, true);
  //   }
  //   return cb(new Error(INVALID_FILE_TYPE));
  // },
});

function makeMulterUploadMiddleware(multerUploadFunction) {
  return (req, res, next) => multerUploadFunction(req, res, (err) => {
    if (err) {
      logger.error('Error while uploading files', err);
      let errorJSON = {
        errorCode: 'FILE_UPLOAD_ERROR',
        message: 'Something wrong ocurred when trying to upload the file',
      };
      // Handle File type error
      if (err.message === INVALID_FILE_TYPE) {
        errorJSON = {
          errorCode: err.message,
          message: `Invalid file type: ${err.message}`,
        };
      } else if (err.code === 'LIMIT_FILE_SIZE') { // Handle File size error
        errorJSON = {
          errorCode: 'LIMIT_FILE_SIZE',
          message: `Invalid file type: ${err.message}`,
        };
      } else if (err.name === 'MulterError') { // handle Multer error
        errorJSON = {
          errorCode: err.name,
          message: `File upload error: ${err.message}`,
        };
      }
      const response = BadRequestResponse({
        errors: [
          errorJSON,
        ],
      }, req.traceId, 'Validation errors');
      return res.status(response.status).json(response);
    }
    return next();
  });
}

module.exports = makeMulterUploadMiddleware(multer.any());
