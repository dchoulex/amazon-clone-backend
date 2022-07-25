const cartController = require("./../controllers/cartController");
const authController = require("./../controllers/authController");

const express = require("express");
const router = express.Router();

router.use(authController.protect);

router
    .route("/")
    .get(cartController.getAllCartItems);

router
    .route("/:productId")
    .post(cartController.addCartItem);

router
    .route("/:id")
    .delete(cartController.deleteCartItem)
    .put(cartController.updateCartItem);

module.exports = router;