const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

//Get environment variables
const envFilePath = path.resolve(__dirname, "config.env");
dotenv.config({ path: envFilePath });

//Import middleware
const app = require("./app");

//Connect to DB
const DATABASE_URL = process.env.DATABASE_URL.replace("<password>", process.env.DATABASE_PASSWORD);

mongoose.connect(DATABASE_URL).then(() => {
    console.log("DB connection success!")
});

//Connect to Server
const PORT = process.env.PORT || "8000";

app.listen(PORT, () => {
    console.log("Server connection success!");
});