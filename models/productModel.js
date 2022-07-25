const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A product must have a name"],
        trim: true,
        maxlength: [50, "A product name must have less or equal than 50 characters"],
        unique: true
    },
    category: {
        type: String,
        required: [true, "A product must have a category"],
        enum: {
            values: ["electronics", "bag", "camera", "computers", "office", "food", "beverage", "alcohol", "sports", "outdoors", "clothing", "shoes", "jewelry", "peripherals"],
            message: "Please input valid category"
        }
    },
    price: {
        type: Number,
        required: [true, "A product must have price"]
    },
    slug: String,
    stock: {
        type: Number,
        default: 50,
        validate: {
            validator: function(stock) {
                return stock > 0
            },
            message: "Stock number must be equal or more than 0"
        }
    },
    totalSold: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        required: [true, "A product must have a description"],
        trim: true
    },
    ratingsAverage: {
        type: Number,
        min: [0, "Rating must be above 0"],
        max: [5, "Rating must be below 5"],
        default: 0
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    images: [String]
});

productSchema.pre("save", function(next) {
    this.slug = slugify(this.name, {
        replacement: "-",
        lower: true,
        trim: true
    });

    this.images = [`${this.slug}.jpg`]
    
    next();
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

const categories = ["electronics", "bag", "camera", "computers", "office", "food", "beverage", "alcohol", "sports", "outdoors", "clothing", "shoes", "jewelry"];