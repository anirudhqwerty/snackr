const jwt = require("jsonwebtoken");

function auth(requiredRole = null) {
  return (req, res, next) => {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({ error: "Missing token" });
    }

    const token = header.split(" ")[1];

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      // attach user info to request
      req.user = payload;

      if (requiredRole && payload.role !== requiredRole) {
        return res.status(403).json({ error: "Forbidden" });
      }

      next();
    } catch {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
}

module.exports = auth;
