const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");

// Import routers
const authRouter = require("./routes/authRoutes");
const productRouter = require("./routes/productRoutes");
const cartRouter = require("./routes/cartRoutes");
const orderRouter = require("./routes/orderRoutes");
const userRouter = require("./routes/userRoutes");
const addressRouter = require("./routes/addressRoutes");
const creditCardRouter = require("./routes/creditCardRoutes");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

//Cyber security middlewares
// const limiter = rateLimit({
//     windowMs: process.env.RATE_LIMITER_TIME_FRAME * 60 * 1000,
//     max: 100,
//     message: "Too many requests from this IP, please try again later.",
//     standardHeaders: true,
//     legacyHeaders: false
// });

// app.use(limiter);
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

app.use(
    cors({
        origin: "*",
        methods: ["GET", "PUT", "POST"],
        allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
        credentials: true
    })
);

// API routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/carts", cartRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/addresses", addressRouter);
app.use("/api/v1/cards", creditCardRouter);

app.use(globalErrorHandler);

module.exports = app;