const boom = require('boom');

const errorCodes = {
  422: 'invalid_data',
  404: 'not_found',
  409: 'already_exists',
};

const boomErrorHandler = (err, _req, res, next) => {
  if (!boom.isBoom(err)) return next(err);

  return res.status(err.output.statusCode).json({
    error: {
      message: err.message,
      code: errorCodes[err.output.statusCode],
      data: err.data,
    },
  });
};

module.exports = boomErrorHandler;
