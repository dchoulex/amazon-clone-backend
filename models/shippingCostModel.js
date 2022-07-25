const mongoose = require("mongoose");

const shippingCostSchema = new monngoose.Schema({
    region: {
        type: String,
        enum: {
            values: ["Hokkaido", "Tohoku", "Kanto", "Chubu", "Kinki", "Chugoku", "Shikoku", "Kyushu"],
            message: "Please input valid region."
        }
    },
    shippingCost: {
        type: Number,
        validate: {
            validator: function(shippingCost) {
                return shippingCost > 0
            },
            message: "Shipping cost must be equal or more than 0."
        }
    },
    isExpedited: Boolean
});

const ShippingCost = mongoose.model("ShippingCost", shippingCostSchema);

module.exports = ShippingCost;