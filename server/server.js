const express = require("express");
const cors = require("cors");
require("dotenv").config(); // loads DB credentials and JWT_SECRET from .env into process.env
require("./models");
const sequelize = require("./config/connection"); // our configured MySQL connection
const authRoutes = require("./routes/auth"); // register/login route handlers
const postRoutes = require("./routes/post");
const categoryRoutes = require("./routes/category");
const commentRoutes = require("./routes/comment");

const app = express();
const PORT = process.env.PORT || 3001; // use env value if set, otherwise default to 3001

// --- Middleware ---
// Parses incoming JSON request bodies and attaches the result to req.body.
// Without this, req.body would be undefined in every route.
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));

// --- Routes ---
// Mounts each route file under its own API prefix.
// e.g. router.post("/register", ...) in auth.js becomes reachable at POST /api/auth/register
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api", commentRoutes);

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
