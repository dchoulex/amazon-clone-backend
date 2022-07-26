const orderController = require("./../controllers/orderController");
const authController = require("./../controllers/authController");

const express = require("express");
const router = express.Router();

router.use(authController.protect);

router
    .route("/")
    .get(orderController.getAllOrders)
    .post(orderController.orderItems);

router
    .route("/:id")
    .get(orderController.getOrder)
    .delete(orderController.cancelOrder);

module.exports = router;