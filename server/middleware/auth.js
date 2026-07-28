const jwt = require("jsonwebtoken");

// Middleware that protects routes by requiring a valid JWT.
// Runs BEFORE the actual route handler on any route it's attached to.
const authMiddleware = (req, res, next) => {
  // Tokens are sent by the client as: Authorization: "Bearer <token>"
  const authHeader = req.headers.authorization;

  // If there's no header at all, or it doesn't start with "Bearer ",
  // there's no token to check — reject immediately.
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  // authHeader looks like "Bearer eyJhbGc..." — split on the space
  // and take the second piece, which is the actual token string.
  const token = authHeader.split(" ")[1];

  try {
    // jwt.verify checks two things: that this token was signed with
    // OUR secret (so it wasn't forged), and that it hasn't expired.
    // If either check fails, it THROWS — it doesn't return false,
    // which is why this is wrapped in a try/catch instead of an if.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded payload (e.g. { id: user.id }) onto req.user,
    // so any route handler running after this middleware knows who
    // is making the request, without re-verifying anything itself.
    req.user = decoded;

    // Everything checked out — let the request continue to the
    // actual route handler.
    next();
  } catch (err) {
    // Token was missing a valid signature, tampered with, or expired.
    // We don't call next() here, so the request stops — the protected
    // route handler never runs.
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;