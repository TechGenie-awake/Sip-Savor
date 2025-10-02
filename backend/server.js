const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const recipeRoutes = require("./routes/recipeRoutes");
const cocktailRoutes = require("./routes/cocktailRoutes");

// Use routes
app.use("/api/recipes", recipeRoutes);
app.use("/api/cocktails", cocktailRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Recipe API: http://localhost:${PORT}/api/recipes`);
  console.log(`Cocktail API: http://localhost:${PORT}/api/cocktails`);
});

module.exports = app;
