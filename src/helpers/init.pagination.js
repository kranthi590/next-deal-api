const { DB_FETCH_SIZE, DB_OFFSET_DEFAULT } = require('./constants');

const initPagination = (req) => {
  const limit = req.query.size ? parseInt(req.query.size, 10) : DB_FETCH_SIZE;
  const offset = req.query.size ? parseInt(req.query.offset, 10) : DB_OFFSET_DEFAULT;
  return {
    limit,
    offset,
  };
};

module.exports = {
  initPagination,
};
