const Review = require("./../models/reviewModel");
const Order = require("./../models/orderModel");
const OrderItem = require("./../models/orderItemModel");
const factory = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getAllMyReviews = factory.getAll(Review);
exports.getReviewDetails = factory.getOne(Review);
exports.deleteReview = factory.deleteOne(Review);

exports.getReviewableProducts = catchAsync(async function(req, res, next) {
    const userId = req.user._id;

    const reviewableProducts = [];
    const reviewableProductIds = new Set();

    const jsonData = {
        status: "success"
    }

    const orders = await Order.find({
        user: userId
    });

    if (orders.length !== 0) {
        for (const order of orders) {
            const orderItems = await OrderItem.find({ order: order._id });

            for (const orderItem of orderItems) {
                const productId = orderItem.product._id + "";

                if (reviewableProductIds.has(productId)) continue;

                reviewableProductIds.add(productId);

                reviewableProducts.push(orderItem);
            }
        };
    };

    res.status(200).json({
        status: "success",
        numOfResults: reviewableProducts.length,
        data: reviewableProducts
    })
});

exports.updateReview = catchAsync(async function(req, res, next) {
    const { productId, id } = req.params;

    const newReview = await Review.findOneAndUpdate({
        _id: id,
        product: productId,
        user: req.user._id
    }, req.body, {
        new: true,
        runValidators: true
    });

    if (!newReview) return next(new AppError(400, "No data found."));

    res.status(200).json({
        status: "success",
        data: newReview
    });
});

exports.getAllProductReviews = catchAsync(async function(req, res) {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId });

    if (reviews.length === 0) {
        return res.status(200).json({
            status: "success",
            message: "No review available yet."
        })
    };

    res.status(200).json({
        status: "success",
        results: reviews.length,
        data: reviews
    });
});

exports.createReview = catchAsync(async function(req, res, next) {
    const userId = req.user._id;
    const { productId } = req.params;
    const { review, rating } = req.body;

    const existingReview = await Review.findOne({ 
        user: userId,
        product: productId
    });

    if (existingReview) return next(new AppError(400, "You can only give review once per product."));

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