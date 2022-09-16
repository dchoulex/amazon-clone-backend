const mongoose = require("mongoose");

const Review = require("./../models/reviewModel");
const Order = require("./../models/orderModel");
const OrderItem = require("./../models/orderItemModel");
const Product = require("./../models/productModel");
const factory = require("./handlerFactory");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getReviewDetails = factory.getOne(Review);
exports.deleteReview = factory.deleteOne(Review);

exports.getAllMyReviews = catchAsync(async function(req, res) {
    const reviews = await Review.find({ 
        user: req.user._id
    });

    const jsonData = {
        status: "success",
        numOfResults: reviews.length,
        data: reviews
    };

    res.status(200).json(jsonData);
});

exports.getReviewableProducts = catchAsync(async function(req, res, next) {
    const userId = req.user._id;

    const reviewableProducts = [];
    const reviewedProductIds = new Set();

    const reviews = await Review.find({ user: userId });

    for (const review of reviews) {
        const productId = review.product._id + "";
        reviewedProductIds.add(productId)
    };

    const orders = await Order.find({
        user: userId
    });

    if (orders.length !== 0) {
        for (const order of orders) {
            const orderItems = await OrderItem.find({ order: order._id });

            for (const orderItem of orderItems) {
                const productId = orderItem.product._id + "";

                if (reviewedProductIds.has(productId)) continue;

                reviewedProductIds.add(productId);

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

    const stats = await Review.aggregate([
        {
            $match: { product: mongoose.Types.ObjectId(productId) }
        }, {
            $group: {
                _id: "$product",
                numberOfRatings: { $sum: 1 },
                ratingsAverage: { $avg: "$rating" }
            }
        }
    ]);
    
    if (stats.length !== 0) {
        await Product.findByIdAndUpdate(productId, {
            ratingsQuantity: stats[0].numberOfRatings,
            ratingsAverage: stats[0].ratingsAverage
        }) 
    };

    res.status(200).json({
        status: "success",
        data: newReview
    });
});

exports.getAllProductReviews = catchAsync(async function(req, res) {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId });

    const jsonData = {
        status: "success",
        data: reviews
    }

    if (reviews.length === 0) {
        jsonData.message = "No review available yet.";
    };

    res.status(200).json(jsonData);
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