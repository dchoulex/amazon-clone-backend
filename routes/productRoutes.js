const productController = require("./../controllers/productController");
const reviewRouter = require("./reviewRoutes");

const express = require("express");
const router = express.Router();

router.use("/:productId/reviews", reviewRouter);

router.get("/best-sellers", productController.getBestSellerProducts);

router
    .route("/")
    .get(productController.getCategoryProducts)
    .post(productController.searchProducts);

router
    .route("/:id")
    .get(productController.getProductDetails);

module.exports = router;