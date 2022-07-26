const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
    phoneNumber: Number,
    creditCard: [String],
    amazonPoints: {
        type: Number,
        default: 0
    }
});

userSchema.pre("save", async function(next) {
    this.password = await bcrypt.hash(this.password, 12);

    next();
});

userSchema.pre(/^find/, function(next) {
    this.find({ isActive: { $ne : false } });

    next();
});

userSchema.methods.validatePassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

const User = mongoose.model("User", userSchema);

module.exports = User;