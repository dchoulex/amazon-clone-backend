const cartController = require("./../controllers/cartController");
const authController = require("./../controllers/authController");

const express = require("express");
const router = express.Router();

router.use(authController.protect);

router
    .route("/")
    .get(cartController.getAllCartItems)
    .post(cartController.addCartItem)
    .put(cartController.checkoutCartItems);

router
    .route("/:id")
    .delete(cartController.deleteCartItem)
    .put(cartController.updateCartItem)
    .patch(cartController.toggleSaveCartItem);

module.exports = router;