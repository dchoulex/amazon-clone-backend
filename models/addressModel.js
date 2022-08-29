const mongoose = require("mongoose");

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
            values: ["Hokkaido", "Tohoku", "Kanto", "Chubu", "Kinki", "Chugoku", "Shikoku", "Kyushu"],
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
        type: Number,
        required: [true, "An address must have phone number."]
    },
    name: {
        type: String,
        required: [true, "An address must have a name."]
    },
    isDefault: {
        type: Boolean,
        default: true
    }
});

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;