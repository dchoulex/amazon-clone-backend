const reviewController = require("./../controllers/reviewController");
const authController = require("./../controllers/authController");

const express = require("express");
const router = express.Router({ mergeParams: true });

router.use(authController.protect);

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