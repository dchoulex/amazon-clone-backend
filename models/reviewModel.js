const mongoose = require("mongoose");
const Product = require("./productModel");

const reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
        required: [true, "A review must belong to a product"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "A review must belong to an user"]
    },
    reviewDate: {
        type: Date,
        default: Date.now(),
        set: function(reviewDate) {
            const offset = new Date().getTimezoneOffset() * 60 * 1000;

            return reviewDate - offset
        }
    },
    review: {
        type: String,
        required: [true, "A review can't be empty"]
    },
    rating: {
        type: Number,
        min: 0,
        max: 5
    }
});

reviewSchema.pre(/^find/, function(next) {
    this.populate({
        path: "user",
        select: "name -_id"
    });

    next();
});

reviewSchema.statics.calculateRatingsAverage = async function(productId) {
    const stats = await this.aggregate([
        {
            $match: {product: productId}
        }, {
            $group: {
                _id: "$product",
                numberOfRatings: { $sum: 1 },
                ratingsAverage: { $avg: "$rating" }
            }
        }
    ]);

    if (stats.length === 0) return;

    await Product.findByIdAndUpdate(productId, {
        ratingsQuantity: stats[0].numberOfRatings,
        ratingsAverage: stats[0].ratingsAverage
    })
};

reviewSchema.post("save", function() {
    this.constructor.calculateRatingsAverage(this.product);
});

reviewSchema.pre(/^find/, async function(next) {
    this.populate({ path: "product" })
});

reviewSchema.pre(/^findOneAnd/, async function(next) {
    this.review = await this.findOne().clone();

    next();
});

reviewSchema.post(/^findOneAnd/, async function() {
    if (!this.review) return;
    
    await this.review.constructor.calculateRatingsAverage(this.review.product);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;