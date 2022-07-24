const slugify = require("slugify");

const categories = ["electronics", "bag", "camera", "computers", "office", "food", "beverage", "alcohol", "sports", "outdoors", "clothing", "shoes", "jewelry"];

const products = [];

const clothingData = ["Black and White T-Shirt", "Black Leather Jacket", "Khaki Jacket", "Purple Jacket", "Red Shirt", "White T-Shirt"];
const bagData = ["Navy Bag"];
const jewelryData = ["Diamond Ring", "Ring", "Silver Bracelet"];

function addDataToProducts(data, category) {
    data.forEach(name => {
        const [name, price] = data.split(",")
        products.push({
            name,
            category,
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean diam diam, volutpat malesuada metus eget, euismod ullamcorper mi. Aliquam interdum libero a dolor cursus vestibulum. Aenean faucibus odio eget dolor tristique vehicula. Fusce vulputate euismod dolor. Aliquam erat volutpat. Nulla placerat tellus id venenatis commodo. Curabitur at euismod nibh. Praesent id arcu tempus, ullamcorper dui nec, sodales libero. Fusce consectetur imperdiet neque, eget hendrerit libero efficitur ac. Aliquam vestibulum urna et erat volutpat condimentum. Ut pharetra ut orci quis lacinia. Donec sed consectetur metus. Aliquam libero turpis, posuere at nunc in, fringilla rhoncus risus. Integer ac odio bibendum, vulputate eros.",
        })
    })
}



categories.forEach(category => {
    products.push({

        category: category
    })
})