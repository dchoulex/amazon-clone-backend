const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const ShippingCost = require("../models/shippingCostModel");

const envFilePath = path.resolve(__dirname, "..", "config.env");
dotenv.config({ path: envFilePath });

const DATABASE_URL = process.env.DATABASE_URL.replace("<password>", process.env.DATABASE_PASSWORD);

mongoose.connect(DATABASE_URL).then(() => {
    console.log("DB connection success!")
});

const shippingCostData = []

// async function importData(shippingCostData) {
//     for (const data in shippingCostData) {

//         try {
            
//             await ShippingCost.create();
//         } catch(err) {
//             console.log(err)
//         }
//     }
//     console.log("Successfully input data!");

//     process.exit();
// };

async function deleteData() {
    try {
        await ShippingCost.deleteMany();
    } catch(err) {
        console.log(err)
    }

    console.log("Successfully delete data!");
    
    process.exit();
};

if (process.argv[2] === "--import") {
    importData(productData);
} else if (process.argv[2] === "--delete") {
    deleteData();
};