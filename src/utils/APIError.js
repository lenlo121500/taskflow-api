class APIError extends Error {
  constructor(statusCode, message, errors = null) {
    super(message);
    this.name = "APIError";
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default APIError;
