const express = require("express");

// Import routers
const authRouter = require("./routes/authRoutes");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.use(express.json())

// API routes
app.use("/api/v1/auth", authRouter);


app.use(globalErrorHandler);

module.exports = app;