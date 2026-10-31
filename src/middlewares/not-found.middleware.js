import APIError from "../utils/APIError.js";

const notFoundMiddleware = (req, res, next) => {
  next(new APIError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export default notFoundMiddleware;
