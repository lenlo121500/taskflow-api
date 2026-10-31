import APIError from "../utils/APIError.js";

const errorMiddleware = (err, req, res, next) => {
  // Delegate if response has already started
  if (res.headersSent) {
    return next(err);
  }

  let error = err;

  // Normalize unexpected errors
  if (!(error instanceof APIError)) {
    error = new APIError(500, "Internal Server Error");
  }

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};

export default errorMiddleware;
