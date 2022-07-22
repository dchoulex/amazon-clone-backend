const mongoose = require("mongoose");
const validator = require("validator")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please input your name."]
    },
    email: {
        type: String,
        required: [true, "Please input your email."],
        unique: true,
        validate: [validator.isEmail, "Please provide a valid email."]
    },
    postCode: String,
    address: String,
    region: String,
    isActive: {
        type: Boolean,
        default: true,
        select: false
    },
    password: {
        type: String,
        required: [true, "Please input your password"],
        minlength: 7,
        select: false
    },
    phoneNumber: String
});

const User = mongoose.model("User", userSchema);

module.exports = User;