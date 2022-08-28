const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("./../utils/appError");

const Address = require("./../models/addressModel");

exports.getAllAddresses = factory.getAll(Address);
exports.deleteAddress = factory.deleteOne(Address);
exports.updateAddress = factory.updateOne(Address);

exports.getDefaultAddress = factory.getOne(Address);

exports.addAddress = catchAsync(async function(req, res) {
    const userId = req.user._id;

    const existingAddress = await Address.findOne({
        postCode
    });

    if (existingAddress) return (next(new AppError(400, "This address have been added.")));

    const newAddress = await Address.create({
        user: userId,
        ...req.body
    });

    res.status(200).json({
        status: "success",
        data: newAddress
    })
});

exports.setAddressAsDefault = catchAsync(async function(req, res, next) {
    const _id = req.params.id;
    const userId = req.user._id;
    const { isDefault } = req.body;

    const address = await Address.findOne({
        _id,
        userId
    });

    if (!address) return next(new AppError(400, "No data found."));

    const newAddress = await Address.findByIdAndUpdate(_id, isDefault);

    res.status(200).json({
        message: "success",
        data: newAddress
    })
});