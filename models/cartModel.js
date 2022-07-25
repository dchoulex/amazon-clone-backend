const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: [true, "A cart item must belong to a product"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "A cart item must belong to an user"]
    },
    amount: {
        type: Number,
        min: 0
    },
    isSaved: {
        type: Boolean,
        isSaved: false
    }
});

cartSchema.pre("save", async function(next) {
    this.populate({ path: "product" });

    next();
});

cartSchema.pre(/^find/, function(next) {
    this.populate({ path: "product" });

    next();
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;