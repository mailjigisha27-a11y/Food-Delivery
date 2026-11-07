const jwt = require("jsonwebtoken");
const User = require("../models/User");

const getToken = (req) => {
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : null;
};

// Use this on routes that need a logged in customer
const requireAuth = async (req, res, next) => {
  try {
    const token = getToken(req);

    if (!token) {
      return res.status(401).json({ message: "Please log in first" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Use this on routes where login is optional (a guest can still continue)
const optionalAuth = async (req, res, next) => {
  try {
    const token = getToken(req);
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (user) req.user = user;
    }
  } catch (err) {
    // A bad or old token is ignored, and the customer continues as a guest
  }
  next();
};

// Use this after requireAuth on routes only an admin may open
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

module.exports = requireAuth;
module.exports.optionalAuth = optionalAuth;
module.exports.requireAdmin = requireAdmin;