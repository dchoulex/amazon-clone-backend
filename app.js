const express = require("express");

// Import routers
const authRouter = require("./routes/authRoutes");
const productRouter = require("./routes/productRoutes");
const cartRouter = require("./routes/cartRoutes");
const orderRouter = require("./routes/orderRoutes");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.use(express.json())

// API routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/carts", cartRouter);
app.use("api/v1/orders", orderRouter);

app.use(globalErrorHandler);

module.exports = app;