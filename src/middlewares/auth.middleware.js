import APIError from "../utils/APIError.js";
import { verifyAccessToken } from "../utils/token.js";
import User from "../modules/user/user.model.js";

const extractToken = (req) => {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    return header.slice(7).trim();
  }
  // Optional: fall back to an httpOnly cookie
  return req.cookies?.accessToken || null;
};

// Requires a valid token
export const authenticate = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) {
      throw new APIError(401, "Authentication required");
    }

    // Throws JsonWebTokenError / TokenExpiredError, which your
    // error middleware already maps to 401
    const decoded = verifyAccessToken(token);

    const user = await User.findById(decoded.sub).select("-password");
    if (!user) {
      throw new APIError(401, "User no longer exists");
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

// Role-based access control; use after authenticate
export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      return next(new APIError(401, "Authentication required"));
    }
    if (!roles.includes(req.user.role)) {
      return next(new APIError(403, "You do not have permission to do this"));
    }
    next();
  };
