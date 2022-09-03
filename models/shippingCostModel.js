const mongoose = require("mongoose");
const { PREFECTURES } = require("./../appConfig");

const shippingCostSchema = new mongoose.Schema({
    prefecture: {
        type: String,
        enum: {
            values: PREFECTURES,
            message: "Please input valid prefecture."
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