const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: [true, "An order must belong to an user."]
        },
        shippingCost: {
            type: mongoose.Schema.ObjectId,
            ref: "ShippingCost",
            required: [true, "An order must have a shipping cost"]
        },
        subTotal: Number,
        total: Number,
        tax: Number,
        discount: {
            type: Number,
            default: 0
        },
        grandTotal: Number,
        paymentMethod: {
            type: String,
            enum: {
                values: ["Credit Card", "Convenience Store", "ATM", "Amazon Points"],
                message: "Please input valid payment method."
            }
        },
        orderDate: {
            type: Date,
            default: Date.now(),
            set: function(orderDate) {
                const offset = new Date().getTimezoneOffset() * 60 * 1000;

                return orderDate - offset
            }
        },
        shippingAddress: {
            type: String,
            required: [true, "An order must have shipping address"]
        },
        isCanceled: {
            type: Boolean,
            default: false
        },
        isExpedited: Boolean
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

orderSchema.virtual("orderItems", {
    ref: "OrderItem",
    foreignField: "order",
    localField: "_id"
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;