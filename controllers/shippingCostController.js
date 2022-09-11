const ShippingCost = require("./../models/shippingCostModel");
const Address = require("./../models/addressModel");

const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

exports.getShippingCost = catchAsync(async function(req, res, next) {
    const { addressId } = req.params;

    const address = await Address.findById(addressId);

    if (!address) return next(new AppError(400, "No address found."));

    const shippingCost = await ShippingCost.findOne({
        prefecture: address.prefecture
    });

    if (!shippingCost) return next(new AppError(400, "No shipping cost found."));

    res.status(200).json({
        status: "success",
        data: shippingCost
    })
});