const slugify = require("slugify");

const catchAsync = require("./../utils/catchAsync");
const Product = require("./../models/productModel");
const Order = require("./../models/orderModel");
const OrderItem = require("./../models/orderItemModel");

exports.searchProducts = catchAsync(async function(req, res) {
    const { category, keyword } = req.body;
    let query = Product.find();

    if (category && category !== "all-categories") {
        query = query.find({ category })
    };

    if (keyword && keyword !== "") {
        const nameKeyword = slugify(keyword, { lower: true });

        query = query.find({
            slug: { $regex: nameKeyword }
        })
    };

    const products = await query;

    const jsonData = {
        status: "success"
    };

    if (products.length === 0) {
        jsonData.message = "No data available yet.";
    } else {
        jsonData.numOfResults = products.length;
    }
    
    jsonData.data = products;

    res.status(200).json(jsonData);
});

exports.getProductDetails = catchAsync(async function(req, res) {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) return next(new AppError(400, "No data found"));

    res.status(200).json({
        status: "success",
        data: product
    });
});

exports.getCategoryProducts = catchAsync(async function(req, res) {
    const category = req.query.category;

    const products = await Product.find({ 
        category: { $in: category.split(",") }
    });

    res.status(200).json({
        status: "success",
        numOfResults: products.length,
        data: products
    })
});

exports.getBestSellerProducts = catchAsync(async function(_, res) {
    const products = await Product.find().sort("-totalSold").limit(10);

    res.status(200).json({
        status: "success",
        numOfResults: products.length,
        data: products
    })
});

exports.getAllProducts = catchAsync(async function(_, res) {
    const products = await Product.find();

    res.status(200).json({
        status: "success",
        numOfResults: products.length,
        data: products
    })
});

exports.getBestReviewProducts = catchAsync(async function(_, res) {
    const products = await Product.find().sort("-ratingsAverage").limit(10);

    res.status(200).json({
        status: "success",
        numOfResults: products.length,
        data: products
    })
});

exports.getRecommendationProducts = catchAsync(async function(req, res) {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId });

    if (!orders) return next(new AppError(400, "You need to order item first to get your recommendation."));

    const countByCategories = {};
    const productIds = new Set();
    const recommendationProducts = [];

    for (const order of orders) {
        const orderItems = await OrderItem.find({ order: order._id });

        for (const orderItem of orderItems) {
            const productId = orderItem.product._id;
            const productCategory = orderItem.product.category;

            productIds.add(productId + "");

            if (!countByCategories[productCategory]) {
                countByCategories[productCategory] = orderItem.amount;
                continue;
            };

            countByCategories[productCategory] += orderItem.amount;
        }
    };

    const sortedCountByCategories = Object.keys(countByCategories)
        .sort((a, b) => countByCategories[b] - countByCategories[a])
        .reduce((object, key, index) => {
            if (index < 3) object[key] = countByCategories[key];

            return object;
        }, {});

    for (const category in sortedCountByCategories) {
        const productsByCategory = await Product.find({ category });

        for (const recommendationProduct of productsByCategory) {
            if (productIds.has(recommendationProduct._id + "")) continue;

            recommendationProducts.push(recommendationProduct)
        }
    };

    res.status(200).json({
        status: "success",
        numOfResults: recommendationProducts.length,
        data: recommendationProducts
    })
});

exports.getBuyAgainProducts = catchAsync(async function(req, res) {
    const userId = req.user._id;
    const orders = await Order.find({ user: userId });

    const buyAgainProducts = [];
    const productIds = new Set();

    for (const order of orders) {
        const orderItems = await OrderItem.find({ order: order._id });

        for (const orderItem of orderItems) {
            const productId = orderItem.product._id;
            const productCategory = orderItem.product.category;

            if (productIds.has(productId + "")) continue;

            productIds.add(productId + "");

            buyAgainProducts.push(orderItem.product);
        }
    };

    res.status(200).json({
        status: "success",
        numOfResults: buyAgainProducts.length,
        data: buyAgainProducts
    })
});