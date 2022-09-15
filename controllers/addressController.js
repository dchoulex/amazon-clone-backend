const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("./../utils/appError");

const Address = require("./../models/addressModel");

exports.updateAddress = factory.updateOne(Address);

exports.getAllAddresses = catchAsync(async function(req, res) {
    const addresses = await Address.find({ 
        user: req.user._id,
        isActive: { $ne: false }
    });

    const jsonData = {
        status: "success",
        numOfResults: addresses.length,
        data: addresses
    };

    res.status(200).json(jsonData);
});

exports.deleteAddress = catchAsync(async function(req, res) {
    const userId = req.user._id;
    const addressId = req.params.id;

    await Address.findOneAndUpdate({
        _id: addressId,
        user: userId
    }, { isActive: false });

    res.status(204).json({
        status: "success",
        data: null
    });
});

exports.getDefaultAddress = catchAsync(async function(req, res, next) {
    const defaultAddress = await Address.findOne({
        user: req.user._id,
        isDefault: true,
        isActive: { $ne: false }
    });

    if (!defaultAddress) return next(new AppError(400, "No default address found. Please set a default address."));

    res.status(200).json({
        status: "success",
        data: defaultAddress
    })
});

exports.addAddress = catchAsync(async function(req, res, next) {
    const userId = req.user._id;
    const { postCode, country, prefecture, city, rest, isDefault, phoneNumber, name } = req.body;

    const existingAddress = await Address.findOne({
        user: userId,
        postCode,
        prefecture,
        city,
        rest
    });

    if (existingAddress) return (next(new AppError(400, "This address has been registered.")));

    //Change existing default address to not default.
    if (isDefault === "true") {
        await Address.updateMany(
            {
                user: userId,
                isDefault: true
            },
            {
                isDefault: false
            }
        )
    };

    const newAddress = await Address.create({
        user: userId,
        country,
        postCode,
        prefecture,
        city,
        rest,
        phoneNumber,
        name,
        isDefault
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
        user: userId,
        isActive: { $ne: false }
    });

    if (!address) return next(new AppError(400, "No data found."));

    if (address.isDefault) return next(new AppError(400, "This address has been set as default."));

    //Change existing default address to not default.
    await Address.updateMany(
        {
            user: userId,
            isDefault: true
        },
        {
            isDefault: false
        }
    );

    const newAddress = await Address.findByIdAndUpdate(_id, 
        { 
            isDefault: true 
        },
        {      
            new: true,
            runValidators: true
        }
    );

    res.status(200).json({
        message: "success",
        data: newAddress
    })
});