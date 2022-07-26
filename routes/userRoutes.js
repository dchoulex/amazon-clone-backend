const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const express = require("express");
const router = express.Router();

router.use(authController.protect);

router.get("/myProfile", userController.getMyProfile);
router.patch("/changePassword", userController.changePassword);
router.patch("/changeName", userController.changeName);
router.patch("/changeEmail", userController.changeEmail);
router.patch("/changePhoneNumber", userController.changePhoneNumber);
router.delete("/deleteAccount", userController.deleteAccount);
// router.post("/resetPassword", userController.resetPassword);

module.exports = router;