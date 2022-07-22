const authController = require("../controllers/authController.js");

const express = require("express");
const router = express.Router();


router.use("/signup", authController.signUp);

module.exports = router;