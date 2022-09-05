const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");

const express = require("express");
const router = express.Router({ mergeParams: true });

router
    .route("/")
    .get(reviewController.getAllProductReviews)
    .post(authController.protect, reviewController.createReview);

router.use(authController.protect);

router
    .route("/:id")
    .get(reviewController.getReviewDetails)
    .delete(reviewController.deleteReview)
    .patch(reviewController.updateReview);

module.exports = router;