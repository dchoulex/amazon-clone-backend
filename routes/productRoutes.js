const productController = require("./../controllers/productController");
const authController = require("./../controllers/authController");
const reviewRouter = require("./reviewRoutes");

const express = require("express");
const router = express.Router();

router.use("/:productId/reviews", reviewRouter);

router.get("/bestSellers", productController.getBestSellerProducts);

router.get("/allProducts", productController.getAllProducts);

router.get("/bestReview", productController.getBestReviewProducts);

router.get("/recommendation", authController.protect, productController.getRecommendationProducts);

router.get("/buyAgain", authController.protect, productController.getBuyAgainProducts);

router
    .route("/")
    .get(productController.getCategoryProducts)
    .post(productController.searchProducts);

router
    .route("/:id")
    .get(productController.getProductDetails);

module.exports = router;