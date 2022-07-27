const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const sendEmail = require("../utils/sendEmail");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const catchAsync = require("../utils/catchAsync");

exports.signUp = catchAsync(async function(req, res) {
    const { name, email, password } = req.body;

    const newUser = await User.create({
        name,
        email,
        password
    });

    createOrSendToken(newUser, 201, res);
});

exports.login = catchAsync(async function(req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError(400, "Please provide email and password!"));
    }

    const user = await User.findOne({ email }).select("+password +isActive");

    if (!user || !(await user.validatePassword(password, user.password)) || !user.isActive) {
        return next(new AppError(401, "Incorrect email or password"));
    };

    createOrSendToken(user, 200, res);
});

exports.forgotPassword = catchAsync(async function(req, res, next) {
    const { email } = req.body;

    const user = await User.findOne({ email }).select("+isActive");

    if (!user || !user.isActive) next(new AppError(400, "User does not exist. Please login."));
    
    const OTP = await user.createOTP();

    await user.save();
    
    try {
        const message = `To authenticate, please use the following One Time Password (OTP): \n${OTP} \nDon't share this OTP with anyone. Our customer service team will never ask you for your password, OTP, credit card, or banking info.\n\nWe hope to see you again soon.`

        await sendEmail({
            email: user.email,
            subject: "Amazon clone password assistance",
            message
        });

        res.status(200).json({
            status: "success",
            message: "OTP sent."
        });
    } catch (err) {
        user.OTP = undefined;
        user.OTPExpires = undefined;

        await user.save();

        return next(500, new AppError("There was an error occur. Please try again later."));
    };
});

exports.verifyOTP = catchAsync(async function(req, res, next) {
    const { OTP } = req.body;

    const user = await User.findOne({ 
        OTP,
        OTPExpires: { $gt: Date.now() }
    }).select("+password");

    if (!user) return next(new AppError(400, "One Time Password (OTP) is invalid or has expired."));

    res.status(200).json({
        status: "success",
        message: "Successfully validate One Time Password (OTP)."
    })
});

exports.resetPassword = catchAsync(async function(req, res, next) {
    const { OTP, password, confirmPassword } = req.body;

    const user = await User.finOne({ OTP }).select("+password");

    if (!user) return next(new AppError(400, "One Time Password (OTP) is invalid or has expired. Please reauthenticate OTP."));

    if (password !== confirmPassword) return next(new AppError(400, "Password and password confirm are not the same. Please input same value."));

    user.OTP = undefined;
    user.OTPExpires = undefined;
    user.password = password;

    await user.save();

    createOrSendToken(user, 200, res);
});

exports.changePassword = catchAsync(async function(req, res, next) {
    const userId = req.user._id;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
        return next(new AppError(400, "Please input all required fields."))
    };

    if (newPassword !== confirmPassword) return next(new AppError(400, "Password and confirm password are different"));

    const user = await User.findById(userId).select("+isActive +password");

    const isValidPassword = await user.validatePassword(oldPassword, user.password);

    if (!user || !user.isActive) return next(new AppError(400, "User does not exist. Please login."));

    if (!isValidPassword) return next(new AppError(400, "Password is wrong. Please input correct password."))

    user.password = newPassword;

    await user.save();

    createOrSendToken(user, 200, res);
});

function createOrSendToken(user, statusCode, res) {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: true
    };

    res.cookie("jwt", token, cookieOptions);

    const userData = {
        name: user.name,
        email: user.email,
        postCode: user.postCode,
        address: user.address,
        region: user.region,
        phoneNumber: user.phoneNumber,
        amazonPoints: user.amazonPoints
    };

    res.status(statusCode).json({
        status: "success",
        token,
        data: userData
    })
}

function signToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

exports.protect = catchAsync(async function(req, _, next) {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    };

    if (!token) return next(new AppError(401, "You are not logged in. Please log in to get access."));

    const decodedPayload = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decodedPayload.userId);

    if (!currentUser) return next(new AppError(401, "Cannot verify user. Please login to get access."));

    const isValidToken = currentUser.checkIsValidToken(decodedPayload.iat);

    if (!isValidToken) return next(new AppError(401, "Token is not valid. Please log in again."));

    req.user = currentUser;

    next();
});

