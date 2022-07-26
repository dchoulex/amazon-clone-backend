const mongoose = require("mongoose");

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;

const creditCardSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "A credit card must belong to an user."]
    },
    type: {
        type: String,
        required: "A credit card must have a type.",
        enum: {
            values: ["mastercard", "visa"],
            message: "Please input valid credit card type."
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    expirationDate: {
        type: Date,
        required: [true, "A credit card must have an expiration date."],
        min: new Date(`${currentMonth}/01/${currentYear}`).getTime()
    },
    number: {
        type: String,
        required: [true, "A credit card must have"],
        validate: {
            validator: function(number) {
                return number.length === 16
            },
            message: "Please input 16 digits."
        }
    },
    isDefault: Boolean,
    name: {
        type: String,
        required: [true, "A credit card must have a name."],
        maxLength: [50, "Please input less than 50 characters."]
    }
});

const CreditCard = mongoose.model("CreditCard", creditCardSchema);

module.exports = CreditCard;