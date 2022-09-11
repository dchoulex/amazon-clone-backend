const authController = require("../controllers/authController");
const addressController = require("../controllers/addressController");
const shippingCostRouter = require("./shippingCostRoutes");

const express = require("express");
const router = express.Router();

router.use(authController.protect);

router.use("/:addressId/shippingCosts", shippingCostRouter)

router
    .route("/")
    .get(addressController.getAllAddresses)
    .post(addressController.addAddress);

router.use("/default", addressController.getDefaultAddress);

router
    .route("/:id")
    .delete(addressController.deleteAddress)   
    .put(addressController.updateAddress)
    .patch(addressController.setAddressAsDefault);

module.exports = router;