const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("./../utils/appError");

const Address = require("./../models/addressModel");

exports.getAllAddresses = factory.getAll(Address);
exports.deleteAddress = factory.deleteOne(Address);
exports.updateAddress = factory.updateOne(Address);

exports.getDefaultAddress = catchAsync(async function(req, res, next) {
    const isDefault = req.query.isDefault === "true";

    const defaultAddress = await Address.findOne({
        user: req.user._id,
        isDefault
    });

    if (!defaultAddress) return next(new AppError(400, "No default address found. Please set a default address."));

    res.status(200).json({
        status: "success",
        data: defaultAddress
    })
});

exports.addAddress = catchAsync(async function(req, res, next) {
    const userId = req.user._id;
    const { postCode, prefecture, city, rest } = req.body;

    const existingAddress = await Address.findOne({
        user: userId,
        postCode,
        prefecture,
        city,
        rest
    });

    if (existingAddress) return (next(new AppError(400, "This address have been registered.")));

    await Address.findOneAndUpdate(
        {
            user: userId,
            isDefault: true
        },
        {
            isDefault: false
        }
    );

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

    const address = await Address.findOne({
        _id,
        userId
    });

    if (!address) return next(new AppError(400, "No data found."));

    if (address.isDefault) return next(new AppError(400, "This address has been set as default."));

    const newAddress = await Address.findByIdAndUpdate(_id, { 
        isDefault: true 
    },
    {      
        new: true,
        runValidators: true
    });

    res.status(200).json({
        message: "success",
        data: newAddress
    })
});