const shippingCostController = require("./../controllers/shippingCostController");
const authController = require("./../controllers/authController");

const express = require("express");
const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
    .route("/")
    .get(shippingCostController.getShippingCost);

module.exports = router;