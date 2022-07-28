const catchAsync = require("./../utils/catchAsync");

const factory = require("./handlerFactory");
const Product = require("./../models/productModel");

exports.getAllProducts = catchAsync(async function(req, res) {
    const products = await Product.find();

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

exports.getProduct = catchAsync(async function(req, res) {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) return next(new AppError(400, "No data found"))

    res.status(200).json({
        status: "success",
        data: product
    });
});