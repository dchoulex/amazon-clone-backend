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

const shippingCostData = [
    {
        prefecture: "Hokkaido",
        standardShippingCost: 450,
        expeditedShippingCost: 550
    },
    {
        prefecture: "Tohoku",
        standardShippingCost: 410,
        expeditedShippingCost: 510
    },
    {
        prefecture: "Kanto",
        standardShippingCost: 410,
        expeditedShippingCost: 510
    },
    {
        prefecture: "Chubu",
        standardShippingCost: 410,
        expeditedShippingCost: 510
    },
    {
        prefecture: "Kinki",
        standardShippingCost: 410,
        expeditedShippingCost: 510
    },
    {
        prefecture: "Chugoku",
        standardShippingCost: 410,
        expeditedShippingCost: 510
    },
    {
        prefecture: "Shikoku",
        standardShippingCost: 410,
        expeditedShippingCost: 510
    },
    {
        prefecture: "Kyushu",
        standardShippingCost: 450,
        expeditedShippingCost: 550
    }
];

async function importData(shippingCostData) {
    for (const shippingCostDatum of shippingCostData) {
        try {
            await ShippingCost.create(shippingCostDatum);
        } catch(err) {
            console.log(err)
        }
    };

    console.log("Successfully input data!");

    process.exit();
};

async function deleteData() {
    try {
        await ShippingCost.deleteMany();
    } catch(err) {
        console.log(err)
    };

    console.log("Successfully delete data!");
    
    process.exit();
};

if (process.argv[2] === "--import") {
    importData(shippingCostData);
} else if (process.argv[2] === "--delete") {
    deleteData();
};