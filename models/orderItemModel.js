const mongoose = require("mongoose");
const { TAX } = require("./../appConfig");

const orderItemSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.ObjectId,
        ref: "Order",
        required: [true, "An order item must belong to an order."]
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: [true, "An order item must belong to a product."]
    },
    priceWhenOrdered: Number,
    amount: {
        type: Number,
        required: [true, "An order item must have an amount."]
    },
    subTotal: Number
});

orderItemSchema.pre("save", function(next) {
    this.subTotal = this.amount * this.priceWhenOrder * (1 + TAX);

    next();
});

const OrderItem = mongoose.model("OrderItem", orderItemSchema);

module.exports = OrderItem;