const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    let token = req.header("Authorization");
    if (token?.startsWith("Bearer ")) {
      token = token.slice(7); // Remove "Bearer " prefix
    }
    
    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error.message);
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

function isAdmin(req, res, next) {
  if (req.user || req.user.isAdmin) {
    next();
  } else {
    return res.status(403).send({ error: "Forbidden" });
  }
  return res.status(403).json({ error: "Forbidden: Admin access required." });
};

module.exports = { verifyToken, isAdmin };