import jwt from "jsonwebtoken";
import httpError from "../utils/httpError.js";
import User from "../models/user.js";

export const userAuth = async (req, res, next) => {
  try {
    // Check if Authorization header is present
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(new httpError("Authentication token required", 401));
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return next(new httpError("Invalid or expired token", 401));
    }

    // Validate user in the database
    const validUser = await User.findById(decoded.id).select("email");
    if (!validUser) {
      return next(new httpError("Unauthorized - user not found or inactive", 404));
    }

    // Attach user info to req.user
    req.user = { id: decoded.id, email: validUser.email };
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return next(new httpError("Invalid or expired token", 401));
    }
    console.error("Authentication error:", error);
    return next(new httpError("Server error during authentication", 500));
  }
};
