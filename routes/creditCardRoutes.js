const authController = require("../controllers/authController");
const creditCardController = require("../controllers/creditCardController");

const express = require("express");
const router = express.Router();

router.use(authController.protect);

router
    .route("/")
    .get(creditCardController.getAllCreditCards)
    .post(creditCardController.addCreditCard);

router.use("/default", creditCardController.getDefaultCreditCard);

router
    .route("/:id")
    .delete(creditCardController.deleteCreditCard)   
    .put(creditCardController.updateCreditCard)
    .patch(creditCardController.setCreditCardAsDefault);

module.exports = router;