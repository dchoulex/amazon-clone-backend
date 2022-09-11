const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Product = require("../models/productModel");
const slugify = require("slugify");

const envFilePath = path.resolve(__dirname, "..", "config.env");
dotenv.config({ path: envFilePath });

const DATABASE_URL = process.env.DATABASE_URL.replace("<password>", process.env.DATABASE_PASSWORD);

mongoose.connect(DATABASE_URL).then(() => {
    console.log("DB connection success!")
});

async function getProduct() {
    let products;
    try {
        products = await Product.find();
    } catch(err) {
        console.log(err)
    }

    console.log(products.map(product => product.slug))

    process.exit();
};

if (process.argv[2] === "--get") {
    console.log("Test")
    getProduct();
}