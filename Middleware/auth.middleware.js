
const jwt = require("jsonwebtoken");
const logger = require("../Helpers/logger"); // ✅ adjust path if needed

const verifyJWT = (req, res, next) => {
  try {
    // 1. Get Authorization header
    const authHeader = req.headers.authorization;

    logger.info("JWT middleware triggered");

    // 2. Check if header exists
    if (!authHeader) {
      logger.warn("Authorization header missing");

      return res.status(401).json({
        success: false,
        message: "Authorization header missing",
      });
    }

    // 3. Extract token from "Bearer TOKEN"
    const token = authHeader.split(" ")[1];

    if (!token) {
      logger.warn("JWT token missing in Authorization header");

      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    logger.info("JWT token received");
    console.log(token);

    // 4. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log(decoded);
    logger.info(`JWT verified successfully for userId: ${decoded.userId || "unknown"}`);

    // 5. Attach user data to request
    req.user = decoded;

    // 6. Continue
    next();
  } catch (error) {
    console.error(error);
    logger.error("JWT verification failed", {
      error: error.message,
      stack: error.stack,
    });

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = verifyJWT;
