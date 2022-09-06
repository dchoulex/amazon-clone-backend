const catchAsync = require("./../utils/catchAsync");

const Product = require("./../models/productModel");
const { default: slugify } = require("slugify");

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
        jsonData.data = products;
    }

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