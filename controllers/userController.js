const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getMyProfile = catchAsync(async function(req, res, next) {
    const userId = req.user._id;

    const user = await User.findOne({ _id: userId }).select("+isActive -_id");

    if (!user || !user.isActive) {
        next(new AppError(404, "You need to login first to show your profile."))
    };

    res.status(200).json({
        status: "success",
        data: user
    });
});

exports.deleteAccount = catchAsync(async function(req, res, next) {
    const user = req.user;

    if (!user.isActive) return next(new AppError(404, "This account does not longer exist."));

    await User.findByIdAndUpdate(user._id, { isActive: false });

    res.status(204).json({
        status: "success",
        data: null
    });
});

exports.changeName = catchAsync(async function(req, res) {
    const userId = req.user._id;
    const { name } = req.body;

    const user = await User.findByIdAndUpdate(userId, { name }, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: "success",
        data: user
    });
});

exports.changeEmail = catchAsync(async function(req, res) {
    const userId = req.user._id;
    const { email } = req.body;

    const user = await User.findByIdAndUpdate(userId, { email }, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: "success",
        data: user
    });
});

exports.changePhoneNumber = catchAsync(async function(req, res) {
    const userId = req.user._id;
    const { phoneNumber } = req.body;

    const user = await User.findByIdAndUpdate(userId, { phoneNumber }, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: "success",
        data: user
    });
});

exports.changePassword = catchAsync(async function(req, res, next) {
    const userId = req.user._id;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) return next(new AppError(404, "Password and confirm password are different"));

    const user = await User.findById(userId);

    user.password = password;

    await user.save();

    res.status(200).json({
        status: "success",
        data: user
    });
});