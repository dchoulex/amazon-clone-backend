const User = require("../models/userModel");

const catchAsync = require("../utils/catchAsync");

exports.signUp = catchAsync(async function(req, res) {
    const { name, email, password } = req.body;

    await User.create({
        name,
        email,
        password
    })

    res.status(201).json({
        message: "Successful!"
    })
});