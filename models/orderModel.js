const mongoose = require("mongoose");

const { PAYMENT_METHODS, DELIVERY_STATUS } = require("../appConfig");

const orderSchema = new mongoose.Schema(
    {
        status: {
            type: String,
            enum: {
                values: DELIVERY_STATUS,
                message: "Please input valid delivery status."
            },
            default: DELIVERY_STATUS[0]
        },
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
                values: PAYMENT_METHODS,
                message: "Please input valid payment method."
            }
        },
        creditCard: {
            type: mongoose.Schema.ObjectId,
            ref: "CreditCard"
        },
        orderDate: {
            type: Date,
            default: Date.now()
        },
        pointUsed: {
            type: Number,
            default: 0
        },
        shippingAddress: {
            type: mongoose.Schema.ObjectId,
            ref: "Address",
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

orderSchema.pre(/^find/, function(next) {
    this.populate({
        path: "shippingAddress creditCard shippingCost",
        select: "-_id"
    });

    this.populate({
        path: "user",
        select: "-passwordResetToken -passwordResetExpires"
    })

    next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;