import mongoose from "mongoose";
import APIError from "../utils/APIError.js";
import logger from "../config/logger.js";

const normalizeError = (err) => {
  if (err instanceof APIError) return err;

  // Malformed JSON body
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return new APIError(400, "Invalid JSON payload");
  }

  // Mongoose: schema validation
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return new APIError(400, "Validation failed", errors);
  }

  // Mongoose: invalid ObjectId, bad type cast
  if (err instanceof mongoose.Error.CastError) {
    return new APIError(400, `Invalid ${err.path}: ${err.value}`);
  }

  // MongoDB: duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || err.keyValue || {})[0];
    return new APIError(409, `${field ?? "Value"} already exists`);
  }

  // JWT
  if (err.name === "TokenExpiredError") {
    return new APIError(401, "Token expired");
  }
  if (err.name === "JsonWebTokenError") {
    return new APIError(401, "Invalid token");
  }

  // Unknown: don't leak internals
  return new APIError(500, "Internal Server Error");
};

const errorMiddleware = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const error = normalizeError(err);
  const statusCode = error.statusCode || 500;

  // Log the ORIGINAL error. 5xx = error, 4xx = warn
  const logLevel = statusCode >= 500 ? "error" : "warn";
  logger[logLevel](err.message, {
    statusCode,
    method: req.method,
    url: req.originalUrl,
    requestId: req.id,
    ...(statusCode >= 500 && { stack: err.stack }),
  });

  res.status(statusCode).json({
    success: false,
    message: error.message,
    ...(error.errors && { errors: error.errors }),
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorMiddleware;
