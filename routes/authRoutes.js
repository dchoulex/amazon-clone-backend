const authController = require("../controllers/authController.js");

const express = require("express");
const router = express.Router();


router.use("/signup", authController.signUp);
router.use("/login", authController.login);

module.exports = router;