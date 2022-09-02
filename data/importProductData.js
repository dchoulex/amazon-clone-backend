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

const productData = {
    clothing: [
        {
            name: "Black and White T-Shirt",
            price: 3000
        }, {
            name: "Black Leather Jacket",
            price: 20000
        }, {
            name: "Khaki Jacket",
            price: 17000
        }, {
            name: "Purple Jacket",
            price: 4320
        }, {
            name: "Red Shirt",
            price: 1500
        }, {
            name: "White T-Shirt",
            price: 1500
        }
    ],
    bag: [
        {
            name: "Navy Bag",
            price: 5000
        }
    ],
    jewelry: [
        {
            name: "Diamond Ring",
            price: 21600
        },
        {
            name: "Bronze Ring",
            price: 1200
        }, {
            name: "Silver Bracelet",
            price: 1180
        }
    ],
    computers: [
        {
            name: "Laptop",
            price: 134800
        }
    ],
    peripherals: [
        {
            name: "Smart Speaker",
            price: 8000
        }, {
            name: "Curved monitor",
            price: 65000
        }, {
            name: "Monitor",
            price: 20000
        }, {
            name: "Mouse",
            price: 4980
        }, {
            name: "SanDisk Micro SD",
            price: 1000
        }, {
            name: "SanDisk SSD",
            price: 21000
        }, {
            name: "SP SSD",
            price: 7600
        }, {
            name: "WD SSD",
            price: 13000
        }
    ],
    office: [
        {
            name: "Standing Desk",
            price: 40000
        }
    ],
    electronics: [
        {
            name: "Washing Machine",
            price: 30000
        }, {
            name: "iPhone",
            price: 120000
        }, {
            name: "Microwave",
            price: 32000
        }, {
            name: "Nintendo Switch",
            price: 36500
        }, {
            name: "Playstation 5",
            price: 43978
        }, {
            name: "Samsung S21 Ultra 5G",
            price: 125000
        }, {
            name: "Tablet",
            price: 25800
        }, {
            name: "Smart Watch",
            price: 20000
        }
    ],
    camera: [
        {
            name: "Camera Lens",
            price: 70000
        },
        {
            name: "Canon Camera",
            price: 45000
        }
    ],
    food: [
        {
            name: "Apple",
            price: 600
        }, {
            name: "Banana",
            price: 200
        }, {
            name: "Blueberry",
            price: 498
        }, {
            name: "Cup Noodle",
            price: 200
        }, {
            name: "Curry Roux",
            price: 240
        }, {
            name: "Honey",
            price: 700
        }, {
            name: "Indomie",
            price: 240
        }
    ],
    beverage: [
        {
            name: "Coffee Beans",
            price: 2000
        }
    ],
    alcohol: [
        {
            name: "Sake",
            price: 1200
        }, {
            name: "Whiskey",
            price: 3000
        }
    ],
    sports: [
        {
            name: "Blue Sportswear Shirt",
            price: 3000
        }, {
            name: "Dumbell",
            price: 6500
        }, {
            name: "Sneakers",
            price: 3450
        }, {
            name: "Whey Protein",
            price: 10000
        }
    ], 
    outdoors: [
        {
            name: "Tent",
            price: 34800
        }
    ]
};

async function importData(productData) {
    for (const category in productData) {
        const products = productData[category];

        for (const product of products) {
            try {
                const newProduct = {
                    name: product.name,
                    category,
                    slug: slugify(product.name, {lower: true}),
                    price: product.price,
                    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean diam diam, volutpat malesuada metus eget, euismod ullamcorper mi. Aliquam interdum libero a dolor cursus vestibulum. Aenean faucibus odio eget dolor tristique vehicula. Fusce vulputate euismod dolor. Aliquam erat volutpat. Nulla placerat tellus id venenatis commodo. Curabitur at euismod nibh. Praesent id arcu tempus, ullamcorper dui nec, sodales libero. Fusce consectetur imperdiet neque, eget hendrerit libero efficitur ac. Aliquam vestibulum urna et erat volutpat condimentum. Ut pharetra ut orci quis lacinia. Donec sed consectetur metus. Aliquam libero turpis, posuere at nunc in, fringilla rhoncus risus. Integer ac odio bibendum, vulputate eros."
                };
        
                await Product.create(newProduct);
            } catch(err) {
                console.log(err)
            }
        }
    }
    console.log("Successfully input data!");

    process.exit();
};

async function deleteData() {
    try {
        await Product.deleteMany();
    } catch(err) {
        console.log(err)
    }

    console.log("Successfully delete data!")
    
    process.exit();
}

if (process.argv[2] === "--import") {
    importData(productData);
} else if (process.argv[2] === "--delete") {
    deleteData();
}