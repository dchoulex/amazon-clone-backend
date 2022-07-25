const Review = require("./../models/reviewModel");
const factory = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);

exports.createReview = catchAsync(async function(req, res, next) {
    const userId = req.user._id;
    const { productId } = req.params;
    const { review, rating } = req.body;

    const existingReview = await Review.findOne({ 
        user: userId,
        product: req.params.productId
    });

    if (existingReview) return next(new AppError(404, "You can only give review once per product."));

    const documentData = {
        user: userId,
        product: productId,
        review,
        rating
    };

    const newReview = await Review.create(documentData);

    res.status(200).json({
        status: "success",
        data: newReview
    });
});