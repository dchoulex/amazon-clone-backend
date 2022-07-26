const User = require("../models/userModel");
const AppError = require("../utils/AppError");
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

    const user = await User.findOne({ email }).select("+password");
    const isValid = await user.validatePassword(password, user.password);

    if (!user || !isValid) {
        return next(new AppError(401, "Incorrect email or password"));
    }

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
        phoneNumber: user.phoneNumber
    }

    res.status(statusCode).json({
        status: "success",
        token,
        data: userData
    })
}

function signToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
};

exports.protect = catchAsync(async function(req, _, next) {
    req.user = {
        _id: "62db5e475f873d5a205603b7",
        region: "Kanto"
    };

    next();
})