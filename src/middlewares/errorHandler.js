import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.name,
      data: err,
    });
    return;
  }
  console.error(err.stack);
  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: {
      message: err.message,
    },
  });
};
