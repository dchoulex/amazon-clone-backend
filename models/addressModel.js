const mongoose = require("mongoose");
const { NUMBER_REGEX } = require("../appConfig");
const { PREFECTURES } = require("./../appConfig");

const addressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "An address must belong to an user."]
    },
    country: {
        type: String,
        default: "Japan"
    },
    postCode: {
        type: Number,
        required: [true, "An address must have an post code."]
    },
    prefecture: {
        type: String,
        enum: {
            values: PREFECTURES,
            message: "Please input valid prefecture."
        }
    },
    city: {
        type: String,
        required: [true, "An address must have a city."]
    },
    rest: {
        type: String,
        required: [true, "An address must have rest of address."]
    },
    phoneNumber: {
        type: String,
        required: [true, "An address must have phone number."],
        validate: {
            validator: function(phoneNumber) {
                return phoneNumber.match(NUMBER_REGEX) && phoneNumber.length === 11
            },
            message: "Please input valid phone number."
        }
    },
    name: {
        type: String,
        required: [true, "An address must have a name."],
        maxLength: [50, "A name must have at most 50 characters."]
    },
    isDefault: Boolean,
    isActive: {
        type: Boolean,
        default: true
    },
});

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;