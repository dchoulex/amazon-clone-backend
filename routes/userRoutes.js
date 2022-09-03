const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const express = require("express");
const router = express.Router();

router.use(authController.protect);

router
    .route("/myProfile")
    .get(userController.getMyProfile)
    .put(userController.updateMyProfile);

router.patch("/changeName", userController.changeName);
router.patch("/changeEmail", userController.changeEmail);
router.patch("/changePhoneNumber", userController.changePhoneNumber);
router.delete("/deleteAccount", userController.deleteAccount);

module.exports = router;