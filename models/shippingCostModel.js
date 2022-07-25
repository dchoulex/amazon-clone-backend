const mongoose = require("mongoose");

const shippingCostSchema = new mongoose.Schema({
    region: {
        type: String,
        enum: {
            values: ["Hokkaido", "Tohoku", "Kanto", "Chubu", "Kinki", "Chugoku", "Shikoku", "Kyushu"],
            message: "Please input valid region."
        }
    },
    standardShippingCost: {
        type: Number,
        validate: {
            validator: function(shippingCost) {
                return shippingCost > 0
            },
            message: "Shipping cost must be equal or more than 0."
        }
    },
    expeditedShippingCost: {
        type: Number,
        validate: {
            validator: function(shippingCost) {
                return shippingCost > 0
            },
            message: "Shipping cost must be equal or more than 0."
        }    
    }
});

const ShippingCost = mongoose.model("ShippingCost", shippingCostSchema);

module.exports = ShippingCost;