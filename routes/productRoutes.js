const productController = require("./../controllers/productController");
const reviewRouter = require("./reviewRoutes");

const express = require("express");
const router = express.Router();

router.use("/:productId/reviews", reviewRouter);

router
    .route("/")
    .get(productController.getAllProducts);

router
    .route("/:id")
    .get(productController.getProduct)

module.exports = router;