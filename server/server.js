const express = require("express");
const cors = require("cors");
require("dotenv").config(); // loads DB credentials and JWT_SECRET from .env into process.env
const sequelize = require("./config/connection"); // our configured MySQL connection
const authRoutes = require("./routes/auth"); // register/login route handlers

const app = express();
const PORT = process.env.PORT || 3001; // use env value if set, otherwise default to 3001

// --- Middleware ---
// Parses incoming JSON request bodies and attaches the result to req.body.
// Without this, req.body would be undefined in every route.
app.use(express.json());
app.use(cors());

// --- Routes ---
// Mounts everything defined in auth.js under the /api/auth prefix.
// e.g. router.post("/register", ...) becomes reachable at POST /api/auth/register
app.use("/api/auth", authRoutes);

// --- Start server ---
// sequelize.sync() checks our models (like User) and creates the matching
// tables in MySQL if they don't already exist. We only start listening for
// requests AFTER this finishes, so nothing can hit a route before the
// database is actually ready.
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
