const express = require("express");

// Import routers
const authRouter = require("./routes/authRoutes");

const app = express();

// API routes
app.use("/api/v1/auth", authRouter);


module.exports = app;