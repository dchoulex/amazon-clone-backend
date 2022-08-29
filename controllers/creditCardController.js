const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("../utils/appError");

const CreditCard = require("../models/creditCardModel");

exports.getAllCreditCards = factory.getAll(CreditCard);
exports.deleteCreditCard = factory.deleteOne(CreditCard);
exports.updateCreditCard = factory.updateOne(CreditCard);

exports.getDefaultCreditCard = catchAsync(async function(req, res, next) {
    const defaultCreditCard = await CreditCard.findOne({
        user: req.user._id,
        isDefault: true
    });

    if (!defaultCreditCard) return next(new AppError(400, "No default address found. Please set a default address."));

    res.status(200).json({
        status: "success",
        data: defaultCreditCard
    })
});

exports.addCreditCard = catchAsync(async function(req, res, next) {
    const userId = req.user._id;
    const { name, type, expirationDate, number, isDefault, user } = req.body;

    const existingCreditCard = await CreditCard.findOne({
        user: userId,
        number
    });

    if (existingCreditCard) return (next(new AppError(400, "This credit card has been registered.")));

    //Change existing default credit card to not default.
    if (isDefault) {
        await CreditCard.findOneAndUpdate(
            {
                user: userId,
                isDefault: true
            },
            {
                isDefault: false
            }
        );
    };

    const newCreditCard = await CreditCard.create({
        user: userId,
        name,
        type,
        expirationDate,
        number,
        isDefault
    });

    res.status(200).json({
        status: "success",
        data: newCreditCard
    })
});

exports.setCreditCardAsDefault = catchAsync(async function(req, res, next) {
    const _id = req.params.id;
    const userId = req.user._id;

    const creditCard = await CreditCard.findOne({
        _id,
        user: userId
    });

    if (!creditCard) return next(new AppError(400, "No data found."));

    if (creditCard.isDefault) return next(new AppError(400, "This credit card has been set as default."));

    //Change existing default credit card to not default.
    await CreditCard.findOneAndUpdate(
        {
            user: userId,
            isDefault: true
        },
        {
            isDefault: false
        }
    );

    const newCreditCard = await CreditCard.findByIdAndUpdate(_id, 
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
        data: newCreditCard
    })
});