function errorMiddleware(error, req, res, next) {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error.';

  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
  });
}

module.exports = errorMiddleware;