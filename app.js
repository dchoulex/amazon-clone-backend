const express = require("express");

// Import routers
const authRouter = require("./routes/authRoutes");
const productRouter = require("./routes/productRoutes");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.use(express.json())

// API routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productRouter);


app.use(globalErrorHandler);

module.exports = app;