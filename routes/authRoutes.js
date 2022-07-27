const authController = require("../controllers/authController.js");

const express = require("express");
const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/verifyOTP", authController.verifyOTP);
router.patch("/resetPassword", authController.resetPassword);

router.use(authController.protect);
router.patch("/changePassword", authController.changePassword);

module.exports = router;