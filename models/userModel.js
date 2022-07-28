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
    },
    passwordChangedAt: {
        type: Date,
        set: function(passwordChangedAt) {
            const offset = new Date().getTimezoneOffset() * 60 * 1000;

            return passwordChangedAt - offset
        }
    },
    OTP: Number,
    OTPExpires: {
        type: Date,
        set: function(OTPExpires) {
            if (!OTPExpires) return;
            const offset = new Date().getTimezoneOffset() * 60 * 1000;

            return OTPExpires - offset
        }
    }
});

userSchema.pre("save", async function(next) {
    if (this.password !== undefined) {
        this.password = await bcrypt.hash(this.password, 12);
    };

    next();
});

userSchema.pre("save", function(next) {
    if (!this.isModified("password") || this.isNew) return next();

    this.passwordChangedAt = Date.now();

    next();
})

userSchema.pre(/^find/, function(next) {
    this.find({ isActive: { $ne : false } });

    next();
});

userSchema.methods.validatePassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createOTP = async function() {
    let OTP = Math.trunc(Math.random() * 1000000);

    if (OTP.toString().length < 6) {
        let digitNeeded = 6 - OTP.toString().length;

        const multiplier = ["1"];

        while (digitNeeded > 0) {
            multiplier.push("0");
            digitNeeded--;
        };

        OTP *= Number(multiplier.join(""));
    };

    this.OTP = OTP;
    this.OTPExpires = Date.now() + process.env.OTP_EXPIRES * 60 * 1000;

    return this.OTP;
};

userSchema.methods.checkIsValidToken = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);

        const offset = new Date().getTimezoneOffset() * 60 * 1000;

        return JWTTimestamp - offset > changedTimestamp;
    };

    return true;
};

const User = mongoose.model("User", userSchema);

module.exports = User;