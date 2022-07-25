const reviewController = require("./../controllers/reviewController");

const express = require("express");
const router = express.Router({ mergeParams: true });

router
    .route("/")
    .get(reviewController.getAllReviews)
    .post(reviewController.createReview);

router
    .route("/:id")
    .get(reviewController.getReview)
    .delete(reviewController.deleteReview)
    .patch(reviewController.updateReview);

module.exports = router;