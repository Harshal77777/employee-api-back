const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  let token = req.header("Authorization");

  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7); // Remove "Bearer " prefix
  }

  if (!token) {
    return res.status(401).send({ error: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).send({ error: "Invalid token" });
  }
}

function isAdmin(req, res, next) {
  if (req.user || req.user.isAdmin) {
    return next(); // ✅ Proceed if user is admin
  }
  return res.status(403).json({ error: "Forbidden: Admin access required." }); // ✅ Only one response
};


module.exports = { verifyToken, isAdmin };
