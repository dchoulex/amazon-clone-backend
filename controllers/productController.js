const catchAsync = require("./../utils/catchAsync");

const factory = require("./handlerFactory");
const Product = require("./../models/productModel");

exports.getAllProducts = factory.getAll(Product);
exports.getProduct = factory.getOne(Product);