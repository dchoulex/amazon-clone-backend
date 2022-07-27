const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getMyProfile = catchAsync(async function(req, res, next) {
    const userId = req.user._id;

    const user = await User.findOne({ _id: userId }).select("+isActive -_id");

    if (!user || !user.isActive) {
        next(new AppError(400, "You need to login first to show your profile."))
    };

    res.status(200).json({
        status: "success",
        data: user
    });
});

exports.deleteAccount = catchAsync(async function(req, res, next) {
    const userId = req.user._id;

    const user = await User.findById(userId).select("+isActive");

    if (!user.isActive) return next(new AppError(400, "This account does not longer exist."));

    await User.findByIdAndUpdate(user._id, { isActive: false });

    res.status(204).json({
        status: "success",
        data: null
    });
});

const changeUserInfo = function(field) {
    return catchAsync(async function(req, res) {
        const userId = req.user._id;
        const changedField = req.body[field];

        const objectBody = {};
        objectBody[field] = changedField;
    
        const user = await User.findByIdAndUpdate(userId, objectBody, {
            new: true,
            runValidators: true
        }).select("+isActive");

        if (!user || !user.isActive) next(new AppError(400, "User does not exist. Please login."));
    
        res.status(200).json({
            status: "success",
            data: user
        });
    });
};

exports.changeName = changeUserInfo("name");
exports.changeEmail = changeUserInfo("email");
exports.changePhoneNumber = changeUserInfo("phoneNumber");