const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const OrderItem = require("../models/orderItemModel");

const envFilePath = path.resolve(__dirname, "..", "config.env");
dotenv.config({ path: envFilePath });

const DATABASE_URL = process.env.DATABASE_URL.replace("<password>", process.env.DATABASE_PASSWORD);

mongoose.connect(DATABASE_URL).then(() => {
    console.log("DB connection success!")
});

async function deleteData() {
    try {
        await Cart.deleteMany();
        await Order.deleteMany();
        await OrderItem.deleteMany();
    } catch(err) {
        console.log(err)
    };

    console.log("Successfully delete data!");
    
    process.exit();
};

if (process.argv[2] === "--delete") {
    deleteData();
};